import re
from datetime import datetime, timedelta, timezone
from typing import TypedDict

import bcrypt
import jwt

from database import get_connection

USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,32}$')


class UserRecord(TypedDict):
  id: int
  username: str
  password_hash: str


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


def get_user_by_username(username: str) -> UserRecord | None:
  conn = get_connection()
  try:
    row = conn.execute(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      (username,),
    ).fetchone()
    if row is None:
      return None
    return {
      'id': row['id'],
      'username': row['username'],
      'password_hash': row['password_hash'],
    }
  finally:
    conn.close()


def create_user(username: str, password: str) -> int:
  now = datetime.now(timezone.utc).isoformat()
  pwd_hash = hash_password(password)
  conn = get_connection()
  try:
    cur = conn.execute(
      'INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)',
      (username, pwd_hash, now),
    )
    conn.commit()
    return int(cur.lastrowid)
  finally:
    conn.close()


def create_access_token(user_id: int, username: str, secret: str) -> str:
  payload = {
    'sub': str(user_id),
    'username': username,
    'exp': datetime.now(timezone.utc) + timedelta(days=7),
  }
  return jwt.encode(payload, secret, algorithm='HS256')
