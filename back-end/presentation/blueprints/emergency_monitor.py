from __future__ import annotations

from http import HTTPStatus

from flask import Blueprint, jsonify, request

from application import emergency as emergency_app
from presentation.http.responses import resposta_api

bp = Blueprint('emergency_monitor', __name__)


@bp.route('/dashboard', methods=['GET'])
def get_dashboard():
  summary = emergency_app.get_dashboard_summary()
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Dashboard carregado.'),
        **summary,
      }
    ),
    code,
  )


@bp.route('/tickets', methods=['GET'])
def get_tickets():
  tickets = emergency_app.list_tickets()
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Chamados carregados.'),
        'chamados': tickets,
      }
    ),
    code,
  )


@bp.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id: int):
  ticket = emergency_app.get_ticket(ticket_id)
  if ticket is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Chamado não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Chamado carregado.'),
        'chamado': ticket,
      }
    ),
    code,
  )


@bp.route('/tickets/<int:ticket_id>/assume', methods=['POST'])
def assume_ticket(ticket_id: int):
  data = request.get_json(silent=True) or {}
  responsavel_raw = data.get('responsavel')
  responsavel = (
    responsavel_raw.strip()
    if isinstance(responsavel_raw, str) and responsavel_raw.strip()
    else 'Atendente atual'
  )
  ticket = emergency_app.assume_ticket(ticket_id, responsavel)
  if ticket is None:
    code = HTTPStatus.CONFLICT
    return (
      jsonify(resposta_api(code, 'Chamado indisponível para atendimento.')),
      code,
    )

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Atendimento assumido.'),
        'chamado': ticket,
      }
    ),
    code,
  )


@bp.route('/tickets/<int:ticket_id>/resolve', methods=['POST'])
def resolve_ticket(ticket_id: int):
  ticket = emergency_app.resolve_ticket(ticket_id)
  if ticket is None:
    code = HTTPStatus.CONFLICT
    return (
      jsonify(resposta_api(code, 'Chamado indisponível para finalização.')),
      code,
    )

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Chamado resolvido.'),
        'chamado': ticket,
      }
    ),
    code,
  )


@bp.route('/attendances', methods=['GET'])
def get_attendances():
  attendances = emergency_app.list_attendances()
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Atendimentos carregados.'),
        'atendimentos': attendances,
      }
    ),
    code,
  )


@bp.route('/users', methods=['GET'])
def get_users():
  users = emergency_app.list_users_summary()
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Usuárias carregadas.'),
        'usuarios': users,
      }
    ),
    code,
  )
