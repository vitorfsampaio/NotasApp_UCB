from __future__ import annotations

from datetime import datetime, timezone

from infrastructure.auth.tokens import hash_password
from infrastructure.database.connection import get_connection


def seed_admin_user() -> None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        'SELECT id FROM users WHERE username = %s LIMIT 1',
        ('admin',),
      )
      existing = cur.fetchone()
      if existing is None:
        cur.execute(
          """
          INSERT INTO users (
            username, password_hash, full_name, onboarding_completed,
            usage_type, main_focus, subscription_plan, created_at
          )
          VALUES (%s, %s, %s, TRUE, %s, %s, %s, %s)
          """,
          (
            'admin',
            hash_password('123'),
            'Administrador',
            'professional',
            'tasks',
            'max',
            datetime.now(timezone.utc).isoformat(),
          ),
        )
      else:
        cur.execute(
          """
          UPDATE users
          SET subscription_plan = 'max'
          WHERE username = 'admin'
            AND (subscription_plan IS NULL OR subscription_plan = '')
          """
        )
    conn.commit()
  finally:
    conn.close()
