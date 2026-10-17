from __future__ import annotations

from datetime import datetime, timezone

from infrastructure.database.connection import get_connection
from infrastructure.serialization import is_valid_uuid, to_iso

PROJECT_COLUMNS = 'id, name, subtitle, progress, created_at, updated_at'


def serialize_project(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'name': row['name'],
    'subtitle': row['subtitle'],
    'progress': int(row['progress']),
    'createdAt': to_iso(row['created_at']),
    'updatedAt': to_iso(row['updated_at']),
  }


def list_projects(user_id: int) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {PROJECT_COLUMNS}
        FROM projects
        WHERE user_id = %s
        ORDER BY updated_at DESC
        """,
        (user_id,),
      )
      rows = cur.fetchall()
    return [serialize_project(row) for row in rows]
  finally:
    conn.close()


def get_project(user_id: int, project_id: str) -> dict | None:
  if not is_valid_uuid(project_id):
    return None

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {PROJECT_COLUMNS}
        FROM projects
        WHERE id = %s AND user_id = %s
        """,
        (project_id, user_id),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return serialize_project(row)
  finally:
    conn.close()


def create_project(user_id: int, name: str, subtitle: str, progress: int) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        INSERT INTO projects (user_id, name, subtitle, progress, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING {PROJECT_COLUMNS}
        """,
        (user_id, name, subtitle, progress, now, now),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_project(row)
  finally:
    conn.close()


def update_project(user_id: int, project_id: str, fields: dict) -> dict | None:
  if not is_valid_uuid(project_id):
    return None

  assignments = []
  values = []
  for column in ('name', 'subtitle', 'progress'):
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
        UPDATE projects
        SET {', '.join(assignments)}
        WHERE id = %s AND user_id = %s
        RETURNING {PROJECT_COLUMNS}
        """,
        (*values, project_id, user_id),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return serialize_project(row)
  finally:
    conn.close()


def delete_project(user_id: int, project_id: str) -> bool:
  if not is_valid_uuid(project_id):
    return False

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM projects
        WHERE id = %s AND user_id = %s
        """,
        (project_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()
