import os

import psycopg
from psycopg.rows import dict_row


def get_database_url() -> str:
  url = (os.environ.get('DATABASE_URL') or '').strip()
  if not url:
    raise RuntimeError(
      'DATABASE_URL não configurada. Defina no .env, ex: postgresql://usuario:senha@localhost:5432/notas_app'
    )
  return url


def get_connection():
  return psycopg.connect(get_database_url(), row_factory=dict_row)


def init_db() -> None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL DEFAULT '',
          onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL
        )
        """
      )
      cur.execute(
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT ''
        """
      )
      cur.execute(
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE
        """
      )
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS notes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_notes_user_updated
        ON notes (user_id, updated_at DESC)
        """
      )
    conn.commit()
  finally:
    conn.close()
