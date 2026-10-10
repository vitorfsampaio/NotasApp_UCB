from flask import Blueprint, jsonify, request
from http import HTTPStatus

from auth_service import require_auth
from tasks_service import create_task, delete_task, get_task, list_tasks, update_task
from util import parse_iso_datetime, resposta_api

bp = Blueprint('tasks', __name__)


def _parse_task_fields(data: dict, partial: bool):
  fields = {}

  if 'title' in data or not partial:
    title_raw = data.get('title')
    if not isinstance(title_raw, str) or not title_raw.strip():
      return None, 'Informe o título da tarefa.'
    fields['title'] = title_raw.strip()

  if 'category' in data:
    category_raw = data.get('category')
    if not isinstance(category_raw, str):
      return None, 'O campo category deve ser texto.'
    fields['category'] = category_raw.strip()
  elif not partial:
    fields['category'] = ''

  if 'dueAt' in data or not partial:
    due_at = parse_iso_datetime(data.get('dueAt'))
    if due_at is None:
      return None, 'Informe uma data válida para a tarefa.'
    fields['due_at'] = due_at

  if 'completed' in data:
    completed_raw = data.get('completed')
    if not isinstance(completed_raw, bool):
      return None, 'O campo completed deve ser booleano.'
    fields['completed'] = completed_raw

  return fields, None


@bp.route('/', methods=['GET'], strict_slashes=False)
@require_auth
def get_tasks(user_id: int):
  tasks = list_tasks(user_id)
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Tarefas carregadas com sucesso.'),
        'tarefas': tasks,
      }
    ),
    code,
  )


@bp.route('/<task_id>', methods=['GET'])
@require_auth
def get_task_by_id(user_id: int, task_id: str):
  task = get_task(user_id, task_id)
  if task is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Tarefa não encontrada.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Tarefa carregada com sucesso.'),
        'tarefa': task,
      }
    ),
    code,
  )


@bp.route('/', methods=['POST'], strict_slashes=False)
@require_auth
def post_task(user_id: int):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_task_fields(data, partial=False)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  task = create_task(user_id, fields['title'], fields['category'], fields['due_at'])
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, 'Tarefa criada com sucesso.'),
        'tarefa': task,
      }
    ),
    code,
  )


@bp.route('/<task_id>', methods=['PUT', 'PATCH'])
@require_auth
def put_task(user_id: int, task_id: str):
  data = request.get_json(silent=True) or {}
  fields, error = _parse_task_fields(data, partial=True)
  if error:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, error)), code

  if not fields:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, 'Informe ao menos um campo para atualizar.')), code

  task = update_task(user_id, task_id, fields)
  if task is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Tarefa não encontrada.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Tarefa atualizada com sucesso.'),
        'tarefa': task,
      }
    ),
    code,
  )


@bp.route('/<task_id>', methods=['DELETE'])
@require_auth
def remove_task(user_id: int, task_id: str):
  deleted = delete_task(user_id, task_id)
  if not deleted:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Tarefa não encontrada.')), code

  code = HTTPStatus.OK
  return jsonify(resposta_api(code, 'Tarefa excluída com sucesso.')), code
