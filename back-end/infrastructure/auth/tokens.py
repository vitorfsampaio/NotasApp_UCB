from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt


def jwt_secret() -> str:
  return os.environ.get('JWT_SECRET', 'dev-secret-change-in-production')


def hash_password(plain: str) -> str:
  return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, password_hash: str) -> bool:
  try:
    return bcrypt.checkpw(plain.encode('utf-8'), password_hash.encode('utf-8'))
  except ValueError:
    return False


def create_access_token(user_id: int, username: str, secret: str) -> str:
  payload = {
    'sub': str(user_id),
    'username': username,
    'exp': datetime.now(timezone.utc) + timedelta(days=7),
  }
  return jwt.encode(payload, secret, algorithm='HS256')


def decode_access_token(token: str, secret: str) -> dict | None:
  try:
    return jwt.decode(token, secret, algorithms=['HS256'])
  except jwt.PyJWTError:
    return None
