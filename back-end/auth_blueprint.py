import os
import sqlite3

from flask import Blueprint, jsonify, request
from http import HTTPStatus

from auth_service import (
  create_access_token,
  create_user,
  get_user_by_username,
  validate_password,
  validate_username,
  verify_password,
)
from util import resposta_api

bp = Blueprint('auth', __name__)


def _jwt_secret() -> str:
  return os.environ.get('JWT_SECRET', 'dev-secret-change-in-production')


@bp.route('/register', methods=['POST'])
def register():
  data = request.get_json(silent=True) or {}
  username_raw = data.get('username')
  password_raw = data.get('password')
  username = username_raw.strip() if isinstance(username_raw, str) else ''
  password = password_raw if isinstance(password_raw, str) else ''

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

  if get_user_by_username(username):
    code = HTTPStatus.CONFLICT
    return jsonify(resposta_api(code, "Este nome de usuário já está em uso.")), code

  try:
    user_id = create_user(username, password)
  except sqlite3.IntegrityError:
    code = HTTPStatus.CONFLICT
    return jsonify(resposta_api(code, "Este nome de usuário já está em uso.")), code

  token = create_access_token(user_id, username, _jwt_secret())
  code = HTTPStatus.CREATED
  return (
    jsonify(
      {
        **resposta_api(code, "Conta criada com sucesso."),
        'token': token,
        'usuario': {'id': user_id, 'username': username},
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

  user = get_user_by_username(username)
  if not user or not verify_password(password, user['password_hash']):
    code = HTTPStatus.UNAUTHORIZED
    return jsonify(resposta_api(code, "Usuário ou senha incorretos.")), code

  token = create_access_token(user['id'], user['username'], _jwt_secret())
  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, "Login realizado com sucesso."),
        'token': token,
        'usuario': {'id': user['id'], 'username': user['username']},
      }
    ),
    code,
  )
