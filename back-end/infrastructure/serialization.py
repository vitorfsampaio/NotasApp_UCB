from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID


def to_iso(value: Any) -> str:
  if isinstance(value, datetime):
    if value.tzinfo is None:
      value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()
  return str(value)


def is_valid_uuid(value: str) -> bool:
  try:
    UUID(value)
    return True
  except (ValueError, TypeError):
    return False
