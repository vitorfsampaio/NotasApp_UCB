from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from infrastructure.database.connection import get_connection
from infrastructure.serialization import is_valid_uuid, to_iso

DEFAULT_CYCLE_LENGTH = 28
DEFAULT_PERIOD_LENGTH = 5
DEFAULT_LUTEAL = 14


def _date_iso(value: date | None) -> str | None:
  if value is None:
    return None
  return value.isoformat()


def serialize_settings(row: dict | None) -> dict:
  if row is None:
    return {
      'averageCycleLength': DEFAULT_CYCLE_LENGTH,
      'averagePeriodLength': DEFAULT_PERIOD_LENGTH,
      'lutealPhaseLength': DEFAULT_LUTEAL,
    }
  return {
    'averageCycleLength': int(row['average_cycle_length']),
    'averagePeriodLength': int(row['average_period_length']),
    'lutealPhaseLength': int(row['luteal_phase_length']),
  }


def serialize_period(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'startDate': _date_iso(row['start_date']),
    'endDate': _date_iso(row['end_date']),
    'createdAt': to_iso(row['created_at']),
    'updatedAt': to_iso(row['updated_at']),
  }


def serialize_log(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'date': _date_iso(row['log_date']),
    'flow': row['flow'] or '',
    'mood': row['mood'] or '',
    'symptoms': list(row['symptoms'] or []),
    'intimacy': bool(row['intimacy']),
    'notes': row['notes'] or '',
    'createdAt': to_iso(row['created_at']),
    'updatedAt': to_iso(row['updated_at']),
  }


def get_settings(user_id: int) -> dict:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT average_cycle_length, average_period_length, luteal_phase_length
        FROM cycle_settings
        WHERE user_id = %s
        """,
        (user_id,),
      )
      row = cur.fetchone()
    return serialize_settings(row)
  finally:
    conn.close()


def upsert_settings(
  user_id: int,
  average_cycle_length: int,
  average_period_length: int,
  luteal_phase_length: int,
) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO cycle_settings (
          user_id, average_cycle_length, average_period_length,
          luteal_phase_length, updated_at
        )
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE SET
          average_cycle_length = EXCLUDED.average_cycle_length,
          average_period_length = EXCLUDED.average_period_length,
          luteal_phase_length = EXCLUDED.luteal_phase_length,
          updated_at = EXCLUDED.updated_at
        RETURNING average_cycle_length, average_period_length, luteal_phase_length
        """,
        (
          user_id,
          average_cycle_length,
          average_period_length,
          luteal_phase_length,
          now,
        ),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_settings(row)
  finally:
    conn.close()


def list_periods(user_id: int, limit: int = 24) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, start_date, end_date, created_at, updated_at
        FROM cycle_periods
        WHERE user_id = %s
        ORDER BY start_date DESC
        LIMIT %s
        """,
        (user_id, limit),
      )
      rows = cur.fetchall()
    return [serialize_period(row) for row in rows]
  finally:
    conn.close()


def create_period(
  user_id: int,
  start_date: date,
  end_date: date | None = None,
) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO cycle_periods (
          user_id, start_date, end_date, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, start_date, end_date, created_at, updated_at
        """,
        (user_id, start_date, end_date, now, now),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_period(row)
  finally:
    conn.close()


def update_period(
  user_id: int,
  period_id: str,
  start_date: date | None = None,
  end_date: date | None = None,
  clear_end: bool = False,
) -> dict | None:
  if not is_valid_uuid(period_id):
    return None
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, start_date, end_date, created_at, updated_at
        FROM cycle_periods
        WHERE id = %s AND user_id = %s
        """,
        (period_id, user_id),
      )
      current = cur.fetchone()
      if current is None:
        return None
      next_start = start_date if start_date is not None else current['start_date']
      if clear_end:
        next_end = None
      elif end_date is not None:
        next_end = end_date
      else:
        next_end = current['end_date']
      cur.execute(
        """
        UPDATE cycle_periods
        SET start_date = %s, end_date = %s, updated_at = %s
        WHERE id = %s AND user_id = %s
        RETURNING id, start_date, end_date, created_at, updated_at
        """,
        (next_start, next_end, now, period_id, user_id),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_period(row) if row else None
  finally:
    conn.close()


def delete_period(user_id: int, period_id: str) -> bool:
  if not is_valid_uuid(period_id):
    return False
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM cycle_periods
        WHERE id = %s AND user_id = %s
        """,
        (period_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()


def list_logs(
  user_id: int,
  start: date | None = None,
  end: date | None = None,
) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      if start and end:
        cur.execute(
          """
          SELECT id, log_date, flow, mood, symptoms, intimacy, notes,
                 created_at, updated_at
          FROM cycle_daily_logs
          WHERE user_id = %s AND log_date BETWEEN %s AND %s
          ORDER BY log_date DESC
          """,
          (user_id, start, end),
        )
      else:
        cur.execute(
          """
          SELECT id, log_date, flow, mood, symptoms, intimacy, notes,
                 created_at, updated_at
          FROM cycle_daily_logs
          WHERE user_id = %s
          ORDER BY log_date DESC
          LIMIT 120
          """,
          (user_id,),
        )
      rows = cur.fetchall()
    return [serialize_log(row) for row in rows]
  finally:
    conn.close()


def upsert_log(
  user_id: int,
  log_date: date,
  flow: str,
  mood: str,
  symptoms: list[str],
  intimacy: bool,
  notes: str,
) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO cycle_daily_logs (
          user_id, log_date, flow, mood, symptoms, intimacy, notes,
          created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (user_id, log_date) DO UPDATE SET
          flow = EXCLUDED.flow,
          mood = EXCLUDED.mood,
          symptoms = EXCLUDED.symptoms,
          intimacy = EXCLUDED.intimacy,
          notes = EXCLUDED.notes,
          updated_at = EXCLUDED.updated_at
        RETURNING id, log_date, flow, mood, symptoms, intimacy, notes,
                  created_at, updated_at
        """,
        (
          user_id,
          log_date,
          flow,
          mood,
          symptoms,
          intimacy,
          notes,
          now,
          now,
        ),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_log(row)
  finally:
    conn.close()


def delete_log(user_id: int, log_id: str) -> bool:
  if not is_valid_uuid(log_id):
    return False
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM cycle_daily_logs
        WHERE id = %s AND user_id = %s
        """,
        (log_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()


def build_overview(user_id: int) -> dict:
  settings = get_settings(user_id)
  periods = list_periods(user_id)
  today = date.today()
  cycle_length = int(settings['averageCycleLength'])
  period_length = int(settings['averagePeriodLength'])
  luteal = int(settings['lutealPhaseLength'])

  last_period = periods[0] if periods else None
  last_start = (
    date.fromisoformat(last_period['startDate'])
    if last_period and last_period['startDate']
    else None
  )

  if last_start is None:
    return {
      'settings': settings,
      'periods': periods,
      'currentCycleDay': None,
      'cycleLength': cycle_length,
      'periodLength': period_length,
      'phase': 'unknown',
      'daysUntilNextPeriod': None,
      'nextPeriodStart': None,
      'nextPeriodEnd': None,
      'fertileWindowStart': None,
      'fertileWindowEnd': None,
      'ovulationDate': None,
      'isPeriodToday': False,
      'isFertileToday': False,
      'predictionReady': False,
    }

  day_index = (today - last_start).days + 1
  while day_index > cycle_length:
    day_index -= cycle_length

  cycles_since = max(0, (today - last_start).days // cycle_length)
  current_cycle_start = last_start + timedelta(days=cycles_since * cycle_length)
  next_period_start = current_cycle_start + timedelta(days=cycle_length)
  next_period_end = next_period_start + timedelta(days=period_length - 1)

  ovulation_offset = max(1, cycle_length - luteal)
  ovulation_date = current_cycle_start + timedelta(days=ovulation_offset - 1)
  fertile_start = ovulation_date - timedelta(days=5)
  fertile_end = ovulation_date + timedelta(days=1)

  current_period_end = current_cycle_start + timedelta(days=period_length - 1)
  is_period_today = current_cycle_start <= today <= current_period_end
  is_fertile_today = fertile_start <= today <= fertile_end

  if is_period_today:
    phase = 'period'
  elif is_fertile_today:
    phase = 'fertile'
  elif today < fertile_start:
    phase = 'follicular'
  else:
    phase = 'luteal'

  days_until = (next_period_start - today).days
  if days_until < 0:
    days_until = 0

  return {
    'settings': settings,
    'periods': periods,
    'currentCycleDay': day_index,
    'cycleLength': cycle_length,
    'periodLength': period_length,
    'phase': phase,
    'daysUntilNextPeriod': days_until,
    'nextPeriodStart': next_period_start.isoformat(),
    'nextPeriodEnd': next_period_end.isoformat(),
    'fertileWindowStart': fertile_start.isoformat(),
    'fertileWindowEnd': fertile_end.isoformat(),
    'ovulationDate': ovulation_date.isoformat(),
    'currentCycleStart': current_cycle_start.isoformat(),
    'isPeriodToday': is_period_today,
    'isFertileToday': is_fertile_today,
    'predictionReady': True,
  }
