from __future__ import annotations

import os
import re
from datetime import datetime, timedelta, timezone
from functools import wraps
from http import HTTPStatus
from typing import TypedDict

import bcrypt
import jwt
from flask import jsonify, request
from psycopg.errors import UniqueViolation

from database import get_connection
from util import resposta_api

USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,32}$')


class UserRecord(TypedDict):
  id: int
  username: str
  password_hash: str
  full_name: str
  onboarding_completed: bool


def jwt_secret() -> str:
  return os.environ.get('JWT_SECRET', 'dev-secret-change-in-production')


def validate_username(username: str) -> bool:
  return bool(username and USERNAME_PATTERN.match(username))


def validate_password(password: str) -> bool:
  return len(password) >= 6


def hash_password(plain: str) -> str:
  return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, password_hash: str) -> bool:
  try:
    return bcrypt.checkpw(plain.encode('utf-8'), password_hash.encode('utf-8'))
  except ValueError:
    return False


def serialize_user(user: UserRecord) -> dict:
  return {
    'id': user['id'],
    'username': user['username'],
    'fullName': user['full_name'],
    'onboardingCompleted': user['onboarding_completed'],
  }


def get_user_by_username(username: str) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, username, password_hash, full_name, onboarding_completed
        FROM users
        WHERE username = %s
        """,
        (username,),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return {
      'id': row['id'],
      'username': row['username'],
      'password_hash': row['password_hash'],
      'full_name': row['full_name'] or '',
      'onboarding_completed': bool(row['onboarding_completed']),
    }
  finally:
    conn.close()


def get_user_by_id(user_id: int) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        SELECT id, username, password_hash, full_name, onboarding_completed
        FROM users
        WHERE id = %s
        """,
        (user_id,),
      )
      row = cur.fetchone()
    if row is None:
      return None
    return {
      'id': row['id'],
      'username': row['username'],
      'password_hash': row['password_hash'],
      'full_name': row['full_name'] or '',
      'onboarding_completed': bool(row['onboarding_completed']),
    }
  finally:
    conn.close()


def create_user(username: str, password: str, full_name: str = '') -> int:
  now = datetime.now(timezone.utc).isoformat()
  pwd_hash = hash_password(password)
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        INSERT INTO users (username, password_hash, full_name, onboarding_completed, created_at)
        VALUES (%s, %s, %s, FALSE, %s)
        RETURNING id
        """,
        (username, pwd_hash, full_name.strip(), now),
      )
      row = cur.fetchone()
    conn.commit()
    return int(row['id'])
  except UniqueViolation:
    conn.rollback()
    raise
  finally:
    conn.close()


def get_onboarding_status(user_id: int) -> bool | None:
  user = get_user_by_id(user_id)
  if user is None:
    return None
  return user['onboarding_completed']


def complete_onboarding(user_id: int) -> UserRecord | None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      cur.execute(
        """
        UPDATE users
        SET onboarding_completed = TRUE
        WHERE id = %s
        RETURNING id, username, password_hash, full_name, onboarding_completed
        """,
        (user_id,),
      )
      row = cur.fetchone()
    conn.commit()
    if row is None:
      return None
    return {
      'id': row['id'],
      'username': row['username'],
      'password_hash': row['password_hash'],
      'full_name': row['full_name'] or '',
      'onboarding_completed': bool(row['onboarding_completed']),
    }
  finally:
    conn.close()


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
