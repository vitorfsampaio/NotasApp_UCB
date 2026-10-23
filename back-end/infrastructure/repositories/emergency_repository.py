from __future__ import annotations

from datetime import datetime, timedelta, timezone

from infrastructure.database.connection import get_connection

TICKET_COLUMNS = (
  'id, user_id, nome, telefone, prioridade, status, responsavel, '
  'latitude, longitude, cidade, created_at, updated_at'
)


def _format_date(value: datetime) -> str:
  local = value.astimezone()
  return local.strftime('%d/%m/%Y')


def _format_time(value: datetime) -> str:
  local = value.astimezone()
  return local.strftime('%H:%M')


def _format_datetime(value: datetime) -> str:
  local = value.astimezone()
  return local.strftime('%d/%m/%Y às %H:%M')


def serialize_ticket(row: dict) -> dict:
  created_at = row['created_at']
  return {
    'id': int(row['id']),
    'userId': row['user_id'],
    'nome': row['nome'],
    'telefone': row['telefone'] or '',
    'data': _format_date(created_at),
    'hora': _format_time(created_at),
    'prioridade': row['prioridade'],
    'status': row['status'],
    'responsavel': row['responsavel'],
    'cidade': row['cidade'] or '',
    'latitude': row['latitude'],
    'longitude': row['longitude'],
    'createdAt': created_at.isoformat(),
    'updatedAt': row['updated_at'].isoformat(),
  }


def serialize_attendance(row: dict) -> dict:
  return {
    'id': int(row['id']),
    'chamadoId': int(row['ticket_id']),
    'nome': row['nome'],
    'responsavel': row['responsavel'],
    'inicio': _format_datetime(row['started_at']),
    'fim': _format_datetime(row['ended_at']) if row['ended_at'] else None,
    'status': row['status'],
  }


def list_tickets() -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {TICKET_COLUMNS}
        FROM emergency_tickets
        ORDER BY created_at DESC
        """
      )
      rows = cur.fetchall()
    return [serialize_ticket(row) for row in rows]
  finally:
    conn.close()


def get_ticket(ticket_id: int) -> dict | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {TICKET_COLUMNS}
        FROM emergency_tickets
        WHERE id = %s
        """,
        (ticket_id,),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return serialize_ticket(row)
  finally:
    conn.close()


def create_ticket(
  nome: str,
  telefone: str,
  prioridade: str = 'ALTA',
  status: str = 'NOVO',
  user_id: int | None = None,
  latitude: float | None = None,
  longitude: float | None = None,
  cidade: str = '',
) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        INSERT INTO emergency_tickets (
          user_id, nome, telefone, prioridade, status, responsavel,
          latitude, longitude, cidade, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, %s, %s, %s)
        RETURNING {TICKET_COLUMNS}
        """,
        (
          user_id,
          nome,
          telefone,
          prioridade,
          status,
          latitude,
          longitude,
          cidade,
          now,
          now,
        ),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_ticket(row)
  finally:
    conn.close()


def assume_ticket(ticket_id: int, responsavel: str) -> dict | None:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        UPDATE emergency_tickets
        SET status = 'EM_ATENDIMENTO',
            responsavel = %s,
            updated_at = %s
        WHERE id = %s AND status = 'NOVO'
        RETURNING {TICKET_COLUMNS}
        """,
        (responsavel, now, ticket_id),
      )
      ticket_row = cur.fetchone()
      if ticket_row is None:
        conn.rollback()
        return None

      cur.execute(
        """
        SELECT id FROM emergency_attendances
        WHERE ticket_id = %s AND status = 'EM_ANDAMENTO'
        LIMIT 1
        """,
        (ticket_id,),
      )
      existing = cur.fetchone()
      if existing is None:
        cur.execute(
          """
          INSERT INTO emergency_attendances (
            ticket_id, nome, responsavel, started_at, ended_at, status
          )
          VALUES (%s, %s, %s, %s, NULL, 'EM_ANDAMENTO')
          """,
          (ticket_id, ticket_row['nome'], responsavel, now),
        )
    conn.commit()
    return serialize_ticket(ticket_row)
  finally:
    conn.close()


def resolve_ticket(ticket_id: int) -> dict | None:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        UPDATE emergency_tickets
        SET status = 'RESOLVIDO', updated_at = %s
        WHERE id = %s AND status IN ('NOVO', 'EM_ATENDIMENTO')
        RETURNING {TICKET_COLUMNS}
        """,
        (now, ticket_id),
      )
      ticket_row = cur.fetchone()
      if ticket_row is None:
        conn.rollback()
        return None

      cur.execute(
        """
        UPDATE emergency_attendances
        SET status = 'FINALIZADO', ended_at = %s
        WHERE ticket_id = %s AND status = 'EM_ANDAMENTO'
        """,
        (now, ticket_id),
      )
    conn.commit()
    return serialize_ticket(ticket_row)
  finally:
    conn.close()


def list_attendances() -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, ticket_id, nome, responsavel, started_at, ended_at, status
        FROM emergency_attendances
        ORDER BY started_at DESC
        """
      )
      rows = cur.fetchall()
    return [serialize_attendance(row) for row in rows]
  finally:
    conn.close()


def list_users_summary() -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT
          MIN(id) AS id,
          nome,
          MAX(telefone) AS telefone,
          COUNT(*) AS total_chamados,
          MAX(created_at) AS ultimo_chamado
        FROM emergency_tickets
        GROUP BY nome
        ORDER BY MAX(created_at) DESC
        """
      )
      rows = cur.fetchall()
    result = []
    for row in rows:
      result.append(
        {
          'id': int(row['id']),
          'nome': row['nome'],
          'telefone': row['telefone'] or '',
          'totalChamados': int(row['total_chamados']),
          'ultimoChamado': _format_date(row['ultimo_chamado']),
          'status': 'ATIVA',
        }
      )
    return result
  finally:
    conn.close()


def get_tickets_by_day(days: int = 7) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT
          (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE prioridade = 'ALTA')::int AS alta,
          COUNT(*) FILTER (WHERE prioridade = 'MEDIA')::int AS media,
          COUNT(*) FILTER (WHERE prioridade = 'BAIXA')::int AS baixa,
          COUNT(*) FILTER (WHERE status = 'NOVO')::int AS novos,
          COUNT(*) FILTER (WHERE status = 'EM_ATENDIMENTO')::int AS em_atendimento,
          COUNT(*) FILTER (WHERE status = 'RESOLVIDO')::int AS resolvidos
        FROM emergency_tickets
        WHERE created_at >= (NOW() AT TIME ZONE 'UTC') - (%s || ' days')::interval
        GROUP BY day
        ORDER BY day ASC
        """,
        (days - 1,),
      )
      rows = cur.fetchall()
  finally:
    conn.close()

  by_day = {
    row['day'].isoformat(): {
      'date': row['day'].isoformat(),
      'label': row['day'].strftime('%d/%m'),
      'total': int(row['total']),
      'alta': int(row['alta']),
      'media': int(row['media']),
      'baixa': int(row['baixa']),
      'novos': int(row['novos']),
      'emAtendimento': int(row['em_atendimento']),
      'resolvidos': int(row['resolvidos']),
    }
    for row in rows
  }

  today = datetime.now(timezone.utc).astimezone().date()
  result = []
  for offset in range(days - 1, -1, -1):
    day = today - timedelta(days=offset)
    key = day.isoformat()
    if key in by_day:
      result.append(by_day[key])
    else:
      result.append(
        {
          'date': key,
          'label': day.strftime('%d/%m'),
          'total': 0,
          'alta': 0,
          'media': 0,
          'baixa': 0,
          'novos': 0,
          'emAtendimento': 0,
          'resolvidos': 0,
        }
      )
  return result


def get_dashboard_summary() -> dict:
  tickets = list_tickets()
  total = len(tickets)
  urgent = len([item for item in tickets if item['prioridade'] == 'ALTA'])
  active = len([item for item in tickets if item['status'] == 'EM_ATENDIMENTO'])
  resolved = len([item for item in tickets if item['status'] == 'RESOLVIDO'])
  novos = len([item for item in tickets if item['status'] == 'NOVO'])

  resolved_percent = round((resolved / total) * 100, 1) if total else 0
  novos_percent = round((novos / total) * 100) if total else 0
  active_percent = round((active / total) * 100) if total else 0
  resolved_bar = round((resolved / total) * 100) if total else 0

  alerts = [
    {
      'id': item['id'],
      'nome': item['nome'],
      'prioridade': item['prioridade'],
      'status': item['status'],
      'horario': item['hora'],
      'cidade': item['cidade'] or 'Localização indisponível',
    }
    for item in tickets
    if item['status'] in ('NOVO', 'EM_ATENDIMENTO')
  ][:6]

  activity = []
  for item in tickets[:8]:
    if item['status'] == 'NOVO':
      title = 'Novo alerta recebido'
      detail = f"{item['nome']} acionou emergência no Planify."
    elif item['status'] == 'EM_ATENDIMENTO':
      title = 'Atendimento iniciado'
      owner = item['responsavel'] or 'Equipe'
      detail = f"{owner} assumiu o chamado #{item['id']}."
    else:
      title = 'Chamado resolvido'
      detail = f"{item['nome']} — suporte concluído."
    activity.append(
      {
        'id': f"t-{item['id']}",
        'title': title,
        'detail': detail,
        'time': f"{item['data']} {item['hora']}",
      }
    )

  return {
    'stats': [
      {
        'id': 'total',
        'label': 'Total de chamados',
        'value': total,
        'hint': 'Registrados na central',
        'tone': 'neutral',
      },
      {
        'id': 'urgent',
        'label': 'Chamados urgentes',
        'value': urgent,
        'hint': 'Prioridade alta',
        'tone': 'danger',
      },
      {
        'id': 'active',
        'label': 'Em atendimento',
        'value': active,
        'hint': 'Equipe ativa agora',
        'tone': 'warning',
      },
      {
        'id': 'resolved',
        'label': 'Resolvidos',
        'value': resolved,
        'hint': f'{resolved_percent}% do total',
        'tone': 'success',
      },
    ],
    'alerts': alerts,
    'ticketsByDay': get_tickets_by_day(7),
    'statusSlices': [
      {
        'label': 'Novos',
        'value': novos,
        'percent': novos_percent,
        'tone': 'new',
      },
      {
        'label': 'Em atendimento',
        'value': active,
        'percent': active_percent,
        'tone': 'progress',
      },
      {
        'label': 'Resolvidos',
        'value': resolved,
        'percent': resolved_bar,
        'tone': 'done',
      },
    ],
    'activity': activity,
  }
