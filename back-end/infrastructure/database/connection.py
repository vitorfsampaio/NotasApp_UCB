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
