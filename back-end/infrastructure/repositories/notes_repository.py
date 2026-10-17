from __future__ import annotations

from datetime import datetime, timezone

from infrastructure.database.connection import get_connection
from infrastructure.serialization import is_valid_uuid, to_iso


def serialize_note(row: dict) -> dict:
  return {
    'id': str(row['id']),
    'title': row['title'],
    'content': row['content'],
    'createdAt': to_iso(row['created_at']),
    'updatedAt': to_iso(row['updated_at']),
  }


def list_notes(user_id: int) -> list[dict]:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, title, content, created_at, updated_at
        FROM notes
        WHERE user_id = %s
        ORDER BY updated_at DESC
        """,
        (user_id,),
      )
      rows = cur.fetchall()
    return [serialize_note(row) for row in rows]
  finally:
    conn.close()


def get_note(user_id: int, note_id: str) -> dict | None:
  if not is_valid_uuid(note_id):
    return None

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, title, content, created_at, updated_at
        FROM notes
        WHERE id = %s AND user_id = %s
        """,
        (note_id, user_id),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return serialize_note(row)
  finally:
    conn.close()


def create_note(user_id: int, title: str, content: str) -> dict:
  now = datetime.now(timezone.utc)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO notes (user_id, title, content, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, title, content, created_at, updated_at
        """,
        (user_id, title, content, now, now),
      )
      row = cur.fetchone()
    conn.commit()
    return serialize_note(row)
  finally:
    conn.close()


def update_note(
  user_id: int, note_id: str, title: str | None, content: str | None
) -> dict | None:
  if not is_valid_uuid(note_id):
    return None

  existing = get_note(user_id, note_id)
  if existing is None:
    return None

  new_title = title if title is not None else existing['title']
  new_content = content if content is not None else existing['content']
  now = datetime.now(timezone.utc)

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        UPDATE notes
        SET title = %s, content = %s, updated_at = %s
        WHERE id = %s AND user_id = %s
        RETURNING id, title, content, created_at, updated_at
        """,
        (new_title, new_content, now, note_id, user_id),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return serialize_note(row)
  finally:
    conn.close()


def delete_note(user_id: int, note_id: str) -> bool:
  if not is_valid_uuid(note_id):
    return False

  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        DELETE FROM notes
        WHERE id = %s AND user_id = %s
        """,
        (note_id, user_id),
      )
      deleted = cur.rowcount > 0
    conn.commit()
    return deleted
  finally:
    conn.close()
