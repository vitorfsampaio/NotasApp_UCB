from __future__ import annotations

from datetime import datetime, timezone

from database import get_connection
from notes_service import _iso
from tasks_service import _valid_uuid

EVENT_COLUMNS = (
  'id, title, category, description, icon, starts_at, duration_minutes, '
  'reminder_minutes, created_at, updated_at'
)


def serialize_event(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'title': row['title'],
    'category': row['category'],
    'description': row['description'],
    'icon': row['icon'],
    'startsAt': _iso(row['starts_at']),
    'durationMinutes': int(row['duration_minutes']),
    'reminderMinutes': row['reminder_minutes'],
    'createdAt': _iso(row['created_at']),
    'updatedAt': _iso(row['updated_at']),
  }


def list_events(user_id: int) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {EVENT_COLUMNS}
        FROM events
        WHERE user_id = %s
        ORDER BY starts_at ASC
        """,
        (user_id,),
      )
      rows = cur.fetchall()
    return [serialize_event(row) for row in rows]
  finally:
    conn.close()


def get_event(user_id: int, event_id: str) -> dict | None:
  if not _valid_uuid(event_id):
    return None

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {EVENT_COLUMNS}
        FROM events
        WHERE id = %s AND user_id = %s
        """,
        (event_id, user_id),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return serialize_event(row)
  finally:
    conn.close()


def create_event(user_id: int, fields: dict) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        INSERT INTO events (
          user_id, title, category, description, icon, starts_at,
          duration_minutes, reminder_minutes, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING {EVENT_COLUMNS}
        """,
        (
          user_id,
          fields['title'],
          fields['category'],
          fields['description'],
          fields['icon'],
          fields['starts_at'],
          fields['duration_minutes'],
          fields['reminder_minutes'],
          now,
          now,
        ),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_event(row)
  finally:
    conn.close()


def update_event(user_id: int, event_id: str, fields: dict) -> dict | None:
  if not _valid_uuid(event_id):
    return None

  allowed = (
    'title',
    'category',
    'description',
    'icon',
    'starts_at',
    'duration_minutes',
    'reminder_minutes',
  )
  assignments = []
  values = []
  for column in allowed:
    if column in fields:
      assignments.append(f'{column} = %s')
      values.append(fields[column])
  assignments.append('updated_at = %s')
  values.append(datetime.now(timezone.utc))

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        UPDATE events
        SET {', '.join(assignments)}
        WHERE id = %s AND user_id = %s
        RETURNING {EVENT_COLUMNS}
        """,
        (*values, event_id, user_id),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return serialize_event(row)
  finally:
    conn.close()


def delete_event(user_id: int, event_id: str) -> bool:
  if not _valid_uuid(event_id):
    return False

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM events
        WHERE id = %s AND user_id = %s
        """,
        (event_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()
