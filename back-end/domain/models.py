from __future__ import annotations

from typing import TypedDict


class UserRecord(TypedDict):
  id: int
  username: str
  password_hash: str
  full_name: str
  onboarding_completed: bool
  usage_type: str
  main_focus: str
  subscription_plan: str


USAGE_TYPES = {'personal', 'professional', 'studies', 'family'}
MAIN_FOCUSES = {'tasks', 'schedule', 'projects', 'notes'}
SUBSCRIPTION_PLANS = {'free', 'pro', 'max'}
EVENT_ICONS = {'calendar', 'idea', 'design', 'search', 'chat', 'edit', 'work', 'heart'}
