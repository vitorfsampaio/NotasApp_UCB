from __future__ import annotations

from datetime import datetime, timezone

from psycopg.errors import UniqueViolation

from domain.models import UserRecord
from infrastructure.database.connection import get_connection

USER_COLUMNS = (
  'id, username, password_hash, full_name, onboarding_completed, usage_type, main_focus'
)


def row_to_user(row: dict) -> UserRecord:
  return {
    'id': row['id'],
    'username': row['username'],
    'password_hash': row['password_hash'],
    'full_name': row['full_name'] or '',
    'onboarding_completed': bool(row['onboarding_completed']),
    'usage_type': row['usage_type'] or '',
    'main_focus': row['main_focus'] or '',
  }


def get_user_by_username(username: str) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {USER_COLUMNS}
        FROM users
        WHERE username = %s
        """,
        (username,),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return row_to_user(row)
  finally:
    conn.close()


def get_user_by_id(user_id: int) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        SELECT {USER_COLUMNS}
        FROM users
        WHERE id = %s
        """,
        (user_id,),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return row_to_user(row)
  finally:
    conn.close()


def create_user(
  username: str,
  password_hash: str,
  full_name: str = '',
  usage_type: str = '',
  main_focus: str = '',
) -> int:
  now = datetime.now(timezone.utc).isoformat()
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO users (
          username, password_hash, full_name, onboarding_completed,
          usage_type, main_focus, created_at
        )
        VALUES (%s, %s, %s, FALSE, %s, %s, %s)
        RETURNING id
        """,
        (username, password_hash, full_name.strip(), usage_type, main_focus, now),
      )
      row = cur.fetchone()
    conn.commit()
    return int(row['id'])
  except UniqueViolation:
    conn.rollback()
    raise
  finally:
    conn.close()


def complete_onboarding(user_id: int) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"""
        UPDATE users
        SET onboarding_completed = TRUE
        WHERE id = %s
        RETURNING {USER_COLUMNS}
        """,
        (user_id,),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return row_to_user(row)
  finally:
    conn.close()
