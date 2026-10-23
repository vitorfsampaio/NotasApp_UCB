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
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT ''
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
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS emergency_tickets (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          nome TEXT NOT NULL,
          telefone TEXT NOT NULL DEFAULT '',
          prioridade TEXT NOT NULL DEFAULT 'ALTA',
          status TEXT NOT NULL DEFAULT 'NOVO',
          responsavel TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          cidade TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_emergency_tickets_status_created
        ON emergency_tickets (status, created_at DESC)
        """
      )
      cur.execute(
        """
        CREATE TABLE IF NOT EXISTS emergency_attendances (
          id SERIAL PRIMARY KEY,
          ticket_id INTEGER NOT NULL REFERENCES emergency_tickets(id) ON DELETE CASCADE,
          nome TEXT NOT NULL,
          responsavel TEXT NOT NULL,
          started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          ended_at TIMESTAMPTZ,
          status TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
      )
      cur.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_emergency_attendances_ticket
        ON emergency_attendances (ticket_id, started_at DESC)
        """
      )
    conn.commit()
  finally:
    conn.close()

  from infrastructure.database.seed_admin import seed_admin_user
  from infrastructure.database.seed_emergency import seed_emergency_data

  seed_admin_user()
  seed_emergency_data()
