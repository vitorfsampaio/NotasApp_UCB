from __future__ import annotations

import re
from datetime import datetime, timezone

USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_]{3,32}$')


def validate_username(username: str) -> bool:
  return bool(username and USERNAME_PATTERN.match(username))


def validate_password(password: str) -> bool:
  return len(password) >= 6


def coordenadas_validas(lat, lon, gps_indisponivel=False):
  try:
    lat = float(lat)
    lon = float(lon)
  except (TypeError, ValueError):
    return False
  if not (-90 <= lat <= 90 and -180 <= lon <= 180):
    return False
  if gps_indisponivel:
    return True
  if lat == 0 and lon == 0:
    return False
  return True


def telefone_valido(numero):
  if numero is None or isinstance(numero, int):
    return False
  padrao = re.compile(r'^\+\d{11,15}$')
  return padrao.match(str(numero)) is not None


def criar_link_maps(latitude, longitude):
  return f'https://www.google.com/maps?q={latitude},{longitude}'


def parse_iso_datetime(value) -> datetime | None:
  if not isinstance(value, str) or not value.strip():
    return None
  raw = value.strip()
  if raw.endswith('Z'):
    raw = raw[:-1] + '+00:00'
  try:
    parsed = datetime.fromisoformat(raw)
  except ValueError:
    return None
  if parsed.tzinfo is None:
    parsed = parsed.replace(tzinfo=timezone.utc)
  return parsed


def verificar_campos(numero, latitude, longitude, nome):
  if numero is None or (isinstance(numero, str) and str(numero).strip() == ''):
    return 'numero'
  if nome is None or (isinstance(nome, str) and str(nome).strip() == ''):
    return 'nome'
  if latitude is None or longitude is None:
    return 'latitude'
  return None
