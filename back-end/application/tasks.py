from datetime import datetime

from infrastructure.repositories import tasks_repository


def list_tasks(user_id: int):
  return tasks_repository.list_tasks(user_id)


def get_task(user_id: int, task_id: str):
  return tasks_repository.get_task(user_id, task_id)


def create_task(user_id: int, title: str, category: str, due_at: datetime):
  return tasks_repository.create_task(user_id, title, category, due_at)


def update_task(user_id: int, task_id: str, fields: dict):
  return tasks_repository.update_task(user_id, task_id, fields)


def delete_task(user_id: int, task_id: str):
  return tasks_repository.delete_task(user_id, task_id)
