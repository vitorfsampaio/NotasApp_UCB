from __future__ import annotations

from functools import wraps
from http import HTTPStatus

from flask import jsonify, request

from infrastructure.auth.tokens import decode_access_token, jwt_secret
from presentation.http.responses import resposta_api


def get_bearer_user_id() -> int | None:
  header = request.headers.get('Authorization', '')
  if not header.startswith('Bearer '):
    return None
  token = header[7:].strip()
  if not token:
    return None
  payload = decode_access_token(token, jwt_secret())
  if not payload or 'sub' not in payload:
    return None
  try:
    return int(payload['sub'])
  except (TypeError, ValueError):
    return None


def require_auth(view):
  @wraps(view)
  def wrapper(*args, **kwargs):
    user_id = get_bearer_user_id()
    if user_id is None:
      code = HTTPStatus.UNAUTHORIZED
      return jsonify(resposta_api(code, 'Token inválido ou ausente.')), code
    return view(user_id, *args, **kwargs)

  return wrapper
