from flask import Blueprint, jsonify, request
from http import HTTPStatus

from auth_service import require_auth
from projects_service import (
  create_project,
  delete_project,
  get_project,
  list_projects,
  update_project,
)
from util import resposta_api

bp = Blueprint('projects', __name__)


def _parse_project_fields(data: dict, partial: bool):
  fields = {}

  if 'name' in data or not partial:
    name_raw = data.get('name')
    if not isinstance(name_raw, str) or not name_raw.strip():
      return None, 'Informe o nome do projeto.'
    fields['name'] = name_raw.strip()

  if 'subtitle' in data:
    subtitle_raw = data.get('subtitle')
    if not isinstance(subtitle_raw, str):
      return None, 'O campo subtitle deve ser texto.'
    fields['subtitle'] = subtitle_raw.strip()
  elif not partial:
    fields['subtitle'] = ''

  if 'progress' in data:
    progress_raw = data.get('progress')
    if not isinstance(progress_raw, int) or isinstance(progress_raw, bool) or not 0 <= progress_raw <= 100:
      return None, 'O progresso deve ser entre 0 e 100.'
    fields['progress'] = progress_raw
  elif not partial:
    fields['progress'] = 0

  return fields, None


@bp.route('/', methods=['GET'], strict_slashes=False)
@require_auth
def get_projects(user_id: int):
  projects = list_projects(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Projetos carregados com sucesso.'),
        'projetos': projects,
      }
    ),
    code,
  )


@bp.route('/<project_id>', methods=['GET'])
@require_auth
def get_project_by_id(user_id: int, project_id: str):
  project = get_project(user_id, project_id)
  if project is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Projeto não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Projeto carregado com sucesso.'),
        'projeto': project,
      }
    ),
    code,
  )


@bp.route('/', methods=['POST'], strict_slashes=False)
@require_auth
def post_project(user_id: int):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_project_fields(data, partial=False)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  project = create_project(user_id, fields['name'], fields['subtitle'], fields['progress'])
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, 'Projeto criado com sucesso.'),
        'projeto': project,
      }
    ),
    code,
  )


@bp.route('/<project_id>', methods=['PUT', 'PATCH'])
@require_auth
def put_project(user_id: int, project_id: str):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_project_fields(data, partial=True)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  if not fields:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe ao menos um campo para atualizar.')), code

  project = update_project(user_id, project_id, fields)
  if project is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Projeto não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Projeto atualizado com sucesso.'),
        'projeto': project,
      }
    ),
    code,
  )


@bp.route('/<project_id>', methods=['DELETE'])
@require_auth
def remove_project(user_id: int, project_id: str):
  deleted = delete_project(user_id, project_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Projeto não encontrado.')), code

  code = HTTPStatus.OK
  return jsonify(resposta_api(code, 'Projeto excluído com sucesso.')), code
