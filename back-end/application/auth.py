from __future__ import annotations

from domain.models import UserRecord
from infrastructure.auth.tokens import (
  create_access_token,
  hash_password,
  jwt_secret,
  verify_password,
)
from infrastructure.repositories import users_repository


def serialize_user(user: UserRecord) -> dict:
  return {
    'id': user['id'],
    'username': user['username'],
    'fullName': user['full_name'],
    'onboardingCompleted': user['onboarding_completed'],
    'usageType': user['usage_type'] or None,
    'mainFocus': user['main_focus'] or None,
  }


def get_user_by_username(username: str) -> UserRecord | None:
  return users_repository.get_user_by_username(username)


def get_user_by_id(user_id: int) -> UserRecord | None:
  return users_repository.get_user_by_id(user_id)


def create_user(
  username: str,
  password: str,
  full_name: str = '',
  usage_type: str = '',
  main_focus: str = '',
) -> int:
  return users_repository.create_user(
    username,
    hash_password(password),
    full_name,
    usage_type,
    main_focus,
  )


def authenticate(username: str, password: str) -> UserRecord | None:
  user = get_user_by_username(username)
  if not user or not verify_password(password, user['password_hash']):
    return None
  return user


def issue_token(user_id: int, username: str) -> str:
  return create_access_token(user_id, username, jwt_secret())


def get_onboarding_status(user_id: int) -> bool | None:
  user = get_user_by_id(user_id)
  if user is None:
    return None
  return user['onboarding_completed']


def complete_onboarding(user_id: int) -> UserRecord | None:
  return users_repository.complete_onboarding(user_id)
