from flask import Blueprint, jsonify, request
from http import HTTPStatus
from psycopg.errors import UniqueViolation

from application import auth as auth_app
from domain.models import MAIN_FOCUSES, USAGE_TYPES
from domain.validators import validate_password, validate_username
from presentation.http.responses import resposta_api

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
  data = request.get_json(silent=True) or {}
  username_raw = data.get('username')
  password_raw = data.get('password')
  full_name_raw = data.get('fullName')
  username = username_raw.strip() if isinstance(username_raw, str) else ''
  password = password_raw if isinstance(password_raw, str) else ''
  full_name = full_name_raw.strip() if isinstance(full_name_raw, str) else ''
  usage_type = data.get('usageType')
  main_focus = data.get('mainFocus')

  if not username or not password:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, "Usuário e senha são obrigatórios.")), code

  if not validate_username(username):
    code = HTTPStatus.BAD_REQUEST
    return jsonify(
      resposta_api(
        code,
        "Usuário deve ter 3 a 32 caracteres (letras, números e _).",
      )
    ), code

  if not validate_password(password):
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, "A senha deve ter pelo menos 6 caracteres.")), code

  if usage_type not in USAGE_TYPES:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, "Escolha para que você vai usar o app.")), code

  if main_focus not in MAIN_FOCUSES:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, "Escolha o que quer organizar primeiro.")), code

  if auth_app.get_user_by_username(username):
    code = HTTPStatus.CONFLICT
    return jsonify(resposta_api(code, "Este nome de usuário já está em uso.")), code

  try:
    user_id = auth_app.create_user(username, password, full_name, usage_type, main_focus)
  except UniqueViolation:
    code = HTTPStatus.CONFLICT
    return jsonify(resposta_api(code, "Este nome de usuário já está em uso.")), code

  token = auth_app.issue_token(user_id, username)
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, "Conta criada com sucesso."),
        'token': token,
        'usuario': {
          'id': user_id,
          'username': username,
          'fullName': full_name,
          'onboardingCompleted': False,
          'usageType': usage_type,
          'mainFocus': main_focus,
        },
      }
    ),
    code,
  )


@bp.route('/login', methods=['POST'])
def login():
  data = request.get_json(silent=True) or {}
  username_raw = data.get('username')
  password_raw = data.get('password')
  username = username_raw.strip() if isinstance(username_raw, str) else ''
  password = password_raw if isinstance(password_raw, str) else ''

  if not username or not password:
    code = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(code, "Usuário e senha são obrigatórios.")), code

  user = auth_app.authenticate(username, password)
  if not user:
    code = HTTPStatus.UNAUTHORIZED
    return jsonify(resposta_api(code, "Usuário ou senha incorretos.")), code

  token = auth_app.issue_token(user['id'], user['username'])
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, "Login realizado com sucesso."),
        'token': token,
        'usuario': auth_app.serialize_user(user),
      }
    ),
    code,
  )
