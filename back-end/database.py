import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
_env_db = (os.environ.get('DATABASE_PATH') or '').strip()
DB_PATH = _env_db if _env_db else str(BASE_DIR / 'notas_app.db')


def get_connection() -> sqlite3.Connection:
  conn = sqlite3.connect(DB_PATH)
  conn.row_factory = sqlite3.Row
  return conn


def init_db() -> None:
  conn = get_connection()
  try:
    conn.execute(
      """
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
      """
    )
    conn.commit()
  finally:
    conn.close()
