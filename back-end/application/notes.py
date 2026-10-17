from __future__ import annotations

from infrastructure.repositories import notes_repository


def list_notes(user_id: int):
  return notes_repository.list_notes(user_id)


def get_note(user_id: int, note_id: str):
  return notes_repository.get_note(user_id, note_id)


def create_note(user_id: int, title: str, content: str):
  return notes_repository.create_note(user_id, title, content)


def update_note(user_id: int, note_id: str, title: str | None, content: str | None):
  return notes_repository.update_note(user_id, note_id, title, content)


def delete_note(user_id: int, note_id: str):
  return notes_repository.delete_note(user_id, note_id)