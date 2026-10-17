from infrastructure.database.connection import get_connection


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
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS usage_type TEXT NOT NULL DEFAULT ''
        """
      )
      cur.execute(
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS main_focus TEXT NOT NULL DEFAULT ''
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
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT '',
          due_at TIMESTAMPTZ NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_tasks_user_due
        ON tasks (user_id, due_at)
        """
      )
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT '',
          description TEXT NOT NULL DEFAULT '',
          icon TEXT NOT NULL DEFAULT 'calendar',
          starts_at TIMESTAMPTZ NOT NULL,
          duration_minutes INTEGER NOT NULL DEFAULT 60,
          reminder_minutes INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_events_user_starts
        ON events (user_id, starts_at)
        """
      )
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          subtitle TEXT NOT NULL DEFAULT '',
          progress INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_projects_user_updated
        ON projects (user_id, updated_at DESC)
        """
      )
    conn.commit()
  finally:
    conn.close()
