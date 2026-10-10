from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from database import get_connection
from notes_service import _iso

TASK_COLUMNS = 'id, title, category, due_at, completed, created_at, updated_at'


def _valid_uuid(value: str) -> bool:
  try:
    UUID(value)
    return True
  except (ValueError, TypeError):
    return False


def serialize_task(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'title': row['title'],
    'category': row['category'],
    'dueAt': _iso(row['due_at']),
    'completed': bool(row['completed']),
    'createdAt': _iso(row['created_at']),
    'updatedAt': _iso(row['updated_at']),
  }


def list_tasks(user_id: int) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {TASK_COLUMNS}
        FROM tasks
        WHERE user_id = %s
        ORDER BY due_at ASC
        """,
        (user_id,),
      )
      rows = cur.fetchall()
    return [serialize_task(row) for row in rows]
  finally:
    conn.close()


def get_task(user_id: int, task_id: str) -> dict | None:
  if not _valid_uuid(task_id):
    return None

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {TASK_COLUMNS}
        FROM tasks
        WHERE id = %s AND user_id = %s
        """,
        (task_id, user_id),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return serialize_task(row)
  finally:
    conn.close()


def create_task(user_id: int, title: str, category: str, due_at: datetime) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        INSERT INTO tasks (user_id, title, category, due_at, completed, created_at, updated_at)
        VALUES (%s, %s, %s, %s, FALSE, %s, %s)
        RETURNING {TASK_COLUMNS}
        """,
        (user_id, title, category, due_at, now, now),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_task(row)
  finally:
    conn.close()


def update_task(user_id: int, task_id: str, fields: dict) -> dict | None:
  if not _valid_uuid(task_id):
    return None

  allowed = {'title': 'title', 'category': 'category', 'due_at': 'due_at', 'completed': 'completed'}
  assignments = []
  values = []
  for key, column in allowed.items():
    if key in fields:
      assignments.append(f'{column} = %s')
      values.append(fields[key])
  assignments.append('updated_at = %s')
  values.append(datetime.now(timezone.utc))

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        UPDATE tasks
        SET {', '.join(assignments)}
        WHERE id = %s AND user_id = %s
        RETURNING {TASK_COLUMNS}
        """,
        (*values, task_id, user_id),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return serialize_task(row)
  finally:
    conn.close()


def delete_task(user_id: int, task_id: str) -> bool:
  if not _valid_uuid(task_id):
    return False

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM tasks
        WHERE id = %s AND user_id = %s
        """,
        (task_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()
