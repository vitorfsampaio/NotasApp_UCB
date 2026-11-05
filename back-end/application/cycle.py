from __future__ import annotations

from datetime import date

from infrastructure.repositories import cycle_repository


def get_overview(user_id: int) -> dict:
  return cycle_repository.build_overview(user_id)


def get_settings(user_id: int) -> dict:
  return cycle_repository.get_settings(user_id)


def update_settings(
  user_id: int,
  average_cycle_length: int,
  average_period_length: int,
  luteal_phase_length: int,
) -> dict:
  return cycle_repository.upsert_settings(
    user_id,
    average_cycle_length,
    average_period_length,
    luteal_phase_length,
  )


def list_periods(user_id: int) -> list[dict]:
  return cycle_repository.list_periods(user_id)


def create_period(
  user_id: int,
  start_date: date,
  end_date: date | None = None,
) -> dict:
  return cycle_repository.create_period(user_id, start_date, end_date)


def update_period(
  user_id: int,
  period_id: str,
  start_date: date | None = None,
  end_date: date | None = None,
  clear_end: bool = False,
) -> dict | None:
  return cycle_repository.update_period(
    user_id,
    period_id,
    start_date,
    end_date,
    clear_end,
  )


def delete_period(user_id: int, period_id: str) -> bool:
  return cycle_repository.delete_period(user_id, period_id)


def list_logs(
  user_id: int,
  start: date | None = None,
  end: date | None = None,
) -> list[dict]:
  return cycle_repository.list_logs(user_id, start, end)


def upsert_log(
  user_id: int,
  log_date: date,
  flow: str,
  mood: str,
  symptoms: list[str],
  intimacy: bool,
  notes: str,
) -> dict:
  return cycle_repository.upsert_log(
    user_id,
    log_date,
    flow,
    mood,
    symptoms,
    intimacy,
    notes,
  )


def delete_log(user_id: int, log_id: str) -> bool:
  return cycle_repository.delete_log(user_id, log_id)
