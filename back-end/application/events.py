from infrastructure.repositories import events_repository


def list_events(user_id: int):
  return events_repository.list_events(user_id)


def get_event(user_id: int, event_id: str):
  return events_repository.get_event(user_id, event_id)


def create_event(user_id: int, fields: dict):
  return events_repository.create_event(user_id, fields)


def update_event(user_id: int, event_id: str, fields: dict):
  return events_repository.update_event(user_id, event_id, fields)


def delete_event(user_id: int, event_id: str):
  return events_repository.delete_event(user_id, event_id)
