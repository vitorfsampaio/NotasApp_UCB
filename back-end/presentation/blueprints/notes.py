from flask import Blueprint, jsonify, request
from http import HTTPStatus

from application import notes as notes_app
from presentation.http.auth import require_auth
from presentation.http.responses import resposta_api

bp = Blueprint('notes', __name__)


@bp.route('/', methods=['GET'], strict_slashes=False)
@require_auth
def get_notes(user_id: int):
  notes = notes_app.list_notes(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Notas carregadas com sucesso.'),
        'notas': notes,
      }
    ),
    code,
  )


@bp.route('/<note_id>', methods=['GET'])
@require_auth
def get_note_by_id(user_id: int, note_id: str):
  note = notes_app.get_note(user_id, note_id)
  if note is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Nota não encontrada.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Nota carregada com sucesso.'),
        'nota': note,
      }
    ),
    code,
  )


@bp.route('/', methods=['POST'], strict_slashes=False)
@require_auth
def post_note(user_id: int):
  data = request.get_json(silent=True) or {}
  title_raw = data.get('title')
  content_raw = data.get('content')

  title = title_raw.strip() if isinstance(title_raw, str) else ''
  content = content_raw if isinstance(content_raw, str) else ''

  if not title:
    title = 'Nota sem título'

  note = notes_app.create_note(user_id, title, content)
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, 'Nota criada com sucesso.'),
        'nota': note,
      }
    ),
    code,
  )


@bp.route('/<note_id>', methods=['PUT', 'PATCH'])
@require_auth
def put_note(user_id: int, note_id: str):
  data = request.get_json(silent=True) or {}

  title = None
  content = None

  if 'title' in data:
    title_raw = data.get('title')
    if not isinstance(title_raw, str):
      code = HTTPStatus.BAD_REQUEST
      return jsonify(resposta_api(code, 'O campo title deve ser texto.')), code
    title = title_raw.strip() or 'Nota sem título'

  if 'content' in data:
    content_raw = data.get('content')
    if not isinstance(content_raw, str):
      code = HTTPStatus.BAD_REQUEST
      return jsonify(resposta_api(code, 'O campo content deve ser texto.')), code
    content = content_raw

  if title is None and content is None:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe title e/ou content para atualizar.')), code

  note = notes_app.update_note(user_id, note_id, title, content)
  if note is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Nota não encontrada.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Nota atualizada com sucesso.'),
        'nota': note,
      }
    ),
    code,
  )


@bp.route('/<note_id>', methods=['DELETE'])
@require_auth
def remove_note(user_id: int, note_id: str):
  deleted = notes_app.delete_note(user_id, note_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Nota não encontrada.')), code

  code = HTTPStatus.OK
  return jsonify(resposta_api(code, 'Nota excluída com sucesso.')), code
