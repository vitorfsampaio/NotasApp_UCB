from __future__ import annotations

from infrastructure.repositories import emergency_repository


def list_tickets():
  return emergency_repository.list_tickets()


def get_ticket(ticket_id: int):
  return emergency_repository.get_ticket(ticket_id)


def create_ticket(
  nome: str,
  telefone: str,
  prioridade: str = 'ALTA',
  user_id: int | None = None,
  latitude: float | None = None,
  longitude: float | None = None,
  cidade: str = '',
):
  return emergency_repository.create_ticket(
    nome=nome,
    telefone=telefone,
    prioridade=prioridade,
    user_id=user_id,
    latitude=latitude,
    longitude=longitude,
    cidade=cidade,
  )


def assume_ticket(ticket_id: int, responsavel: str):
  return emergency_repository.assume_ticket(ticket_id, responsavel)


def resolve_ticket(ticket_id: int):
  return emergency_repository.resolve_ticket(ticket_id)


def list_attendances():
  return emergency_repository.list_attendances()


def list_users_summary():
  return emergency_repository.list_users_summary()


def get_dashboard_summary():
  return emergency_repository.get_dashboard_summary()
