from __future__ import annotations

from datetime import date
from http import HTTPStatus

from flask import Blueprint, jsonify, request

from application import cycle as cycle_app
from presentation.http.auth import require_auth
from presentation.http.responses import resposta_api

bp = Blueprint('cycle', __name__)

FLOW_OPTIONS = {'', 'spotting', 'light', 'medium', 'heavy'}
MOOD_OPTIONS = {
  '',
  'calm',
  'happy',
  'sensitive',
  'anxious',
  'tired',
  'energetic',
  'irritated',
}


def _parse_date(value: object) -> date | None:
  if not isinstance(value, str) or not value.strip():
    return None
  try:
    return date.fromisoformat(value.strip()[:10])
  except ValueError:
    return None


def _clamp_int(value: object, default: int, minimum: int, maximum: int) -> int:
  try:
    number = int(value)
  except (TypeError, ValueError):
    return default
  return max(minimum, min(maximum, number))


@bp.route('/overview', methods=['GET'])
@require_auth
def get_overview(user_id: int):
  overview = cycle_app.get_overview(user_id)
  logs = cycle_app.list_logs(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Ciclo carregado.'),
        'overview': overview,
        'logs': logs,
      }
    ),
    code,
  )


@bp.route('/settings', methods=['GET'])
@require_auth
def get_settings(user_id: int):
  settings = cycle_app.get_settings(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Configurações do ciclo carregadas.'),
        'settings': settings,
      }
    ),
    code,
  )


@bp.route('/settings', methods=['PUT', 'PATCH'])
@require_auth
def put_settings(user_id: int):
  data = request.get_json(silent=True) or {}
  settings = cycle_app.update_settings(
    user_id,
    _clamp_int(data.get('averageCycleLength'), 28, 21, 45),
    _clamp_int(data.get('averagePeriodLength'), 5, 2, 10),
    _clamp_int(data.get('lutealPhaseLength'), 14, 10, 16),
  )
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Configurações do ciclo atualizadas.'),
        'settings': settings,
        'overview': cycle_app.get_overview(user_id),
      }
    ),
    code,
  )


@bp.route('/periods', methods=['GET'])
@require_auth
def get_periods(user_id: int):
  periods = cycle_app.list_periods(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Períodos carregados.'),
        'periods': periods,
      }
    ),
    code,
  )


@bp.route('/periods', methods=['POST'])
@require_auth
def post_period(user_id: int):
  data = request.get_json(silent=True) or {}
  start = _parse_date(data.get('startDate'))
  end = _parse_date(data.get('endDate'))
  if start is None:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe a data de início do período.')), code
  if end is not None and end < start:
    code = HTTPStatus.BAD_REQUEST
    return (
      jsonify(resposta_api(code, 'A data final não pode ser antes do início.')),
      code,
    )
  period = cycle_app.create_period(user_id, start, end)
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, 'Período registrado.'),
        'period': period,
        'overview': cycle_app.get_overview(user_id),
      }
    ),
    code,
  )


@bp.route('/periods/<period_id>', methods=['PUT', 'PATCH'])
@require_auth
def put_period(user_id: int, period_id: str):
  data = request.get_json(silent=True) or {}
  start = _parse_date(data.get('startDate')) if 'startDate' in data else None
  clear_end = data.get('endDate') is None and 'endDate' in data
  end = _parse_date(data.get('endDate')) if not clear_end else None
  period = cycle_app.update_period(
    user_id,
    period_id,
    start,
    end,
    clear_end=clear_end,
  )
  if period is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Período não encontrado.')), code
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Período atualizado.'),
        'period': period,
        'overview': cycle_app.get_overview(user_id),
      }
    ),
    code,
  )


@bp.route('/periods/<period_id>', methods=['DELETE'])
@require_auth
def delete_period(user_id: int, period_id: str):
  deleted = cycle_app.delete_period(user_id, period_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Período não encontrado.')), code
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Período removido.'),
        'overview': cycle_app.get_overview(user_id),
      }
    ),
    code,
  )


@bp.route('/logs', methods=['GET'])
@require_auth
def get_logs(user_id: int):
  start = _parse_date(request.args.get('start'))
  end = _parse_date(request.args.get('end'))
  logs = cycle_app.list_logs(user_id, start, end)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Registros do ciclo carregados.'),
        'logs': logs,
      }
    ),
    code,
  )


@bp.route('/logs', methods=['POST', 'PUT', 'PATCH'])
@require_auth
def upsert_log(user_id: int):
  data = request.get_json(silent=True) or {}
  log_date = _parse_date(data.get('date'))
  if log_date is None:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe a data do registro.')), code

  flow_raw = data.get('flow')
  mood_raw = data.get('mood')
  flow = flow_raw.strip() if isinstance(flow_raw, str) else ''
  mood = mood_raw.strip() if isinstance(mood_raw, str) else ''
  if flow not in FLOW_OPTIONS:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Fluxo inválido.')), code
  if mood not in MOOD_OPTIONS:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Humor inválido.')), code

  symptoms_raw = data.get('symptoms')
  symptoms: list[str] = []
  if isinstance(symptoms_raw, list):
    for item in symptoms_raw:
      if isinstance(item, str) and item.strip():
        symptoms.append(item.strip()[:40])

  notes_raw = data.get('notes')
  notes = notes_raw.strip() if isinstance(notes_raw, str) else ''
  intimacy = bool(data.get('intimacy'))

  log = cycle_app.upsert_log(
    user_id,
    log_date,
    flow,
    mood,
    symptoms[:12],
    intimacy,
    notes[:1000],
  )
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Registro do dia salvo.'),
        'log': log,
        'overview': cycle_app.get_overview(user_id),
      }
    ),
    code,
  )


@bp.route('/logs/<log_id>', methods=['DELETE'])
@require_auth
def delete_log(user_id: int, log_id: str):
  deleted = cycle_app.delete_log(user_id, log_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Registro não encontrado.')), code
  code = HTTPStatus.OK
  return jsonify(resposta_api(code, 'Registro removido.')), code
