from __future__ import annotations

from http import HTTPStatus


def resposta_api(codigo: HTTPStatus, mensagem: str) -> dict[str, str | int]:
  return {
    'codigo': codigo,
    'mensagem': mensagem,
  }
