from flask import Blueprint, jsonify, request
from http import HTTPStatus

from application import events as events_app
from domain.models import EVENT_ICONS
from domain.validators import parse_iso_datetime
from presentation.http.auth import require_auth
from presentation.http.responses import resposta_api

bp = Blueprint('events', __name__)

def _parse_event_fields(data: dict, partial: bool):
  fields = {}

  if 'title' in data or not partial:
    title_raw = data.get('title')
    if not isinstance(title_raw, str) or not title_raw.strip():
      return None, 'Informe o título do evento.'
    fields['title'] = title_raw.strip()

  for key in ('category', 'description'):
    if key in data:
      raw = data.get(key)
      if not isinstance(raw, str):
        return None, f'O campo {key} deve ser texto.'
      fields[key] = raw.strip()
    elif not partial:
      fields[key] = ''

  if 'icon' in data:
    icon_raw = data.get('icon')
    if icon_raw not in EVENT_ICONS:
      return None, 'Ícone do evento inválido.'
    fields['icon'] = icon_raw
  elif not partial:
    fields['icon'] = 'calendar'

  if 'startsAt' in data or not partial:
    starts_at = parse_iso_datetime(data.get('startsAt'))
    if starts_at is None:
      return None, 'Informe uma data e hora válidas para o evento.'
    fields['starts_at'] = starts_at

  if 'durationMinutes' in data:
    duration_raw = data.get('durationMinutes')
    if not isinstance(duration_raw, int) or isinstance(duration_raw, bool) or not 5 <= duration_raw <= 1440:
      return None, 'A duração deve ser entre 5 e 1440 minutos.'
    fields['duration_minutes'] = duration_raw
  elif not partial:
    fields['duration_minutes'] = 60

  if 'reminderMinutes' in data:
    reminder_raw = data.get('reminderMinutes')
    if reminder_raw is not None and (
      not isinstance(reminder_raw, int) or isinstance(reminder_raw, bool) or not 0 <= reminder_raw <= 10080
    ):
      return None, 'O lembrete deve ser entre 0 e 10080 minutos.'
    fields['reminder_minutes'] = reminder_raw
  elif not partial:
    fields['reminder_minutes'] = None

  return fields, None


@bp.route('/', methods=['GET'], strict_slashes=False)
@require_auth
def get_events(user_id: int):
  events = events_app.list_events(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Eventos carregados com sucesso.'),
        'eventos': events,
      }
    ),
    code,
  )


@bp.route('/<event_id>', methods=['GET'])
@require_auth
def get_event_by_id(user_id: int, event_id: str):
  event = events_app.get_event(user_id, event_id)
  if event is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Evento não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Evento carregado com sucesso.'),
        'evento': event,
      }
    ),
    code,
  )


@bp.route('/', methods=['POST'], strict_slashes=False)
@require_auth
def post_event(user_id: int):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_event_fields(data, partial=False)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  event = events_app.create_event(user_id, fields)
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, 'Evento criado com sucesso.'),
        'evento': event,
      }
    ),
    code,
  )


@bp.route('/<event_id>', methods=['PUT', 'PATCH'])
@require_auth
def put_event(user_id: int, event_id: str):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_event_fields(data, partial=True)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  if not fields:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe ao menos um campo para atualizar.')), code

  event = events_app.update_event(user_id, event_id, fields)
  if event is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Evento não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Evento atualizado com sucesso.'),
        'evento': event,
      }
    ),
    code,
  )


@bp.route('/<event_id>', methods=['DELETE'])
@require_auth
def remove_event(user_id: int, event_id: str):
  deleted = events_app.delete_event(user_id, event_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Evento não encontrado.')), code

  code = HTTPStatus.OK
  return jsonify(resposta_api(code, 'Evento excluído com sucesso.')), code
