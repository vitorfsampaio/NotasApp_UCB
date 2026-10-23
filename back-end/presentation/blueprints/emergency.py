from __future__ import annotations

from http import HTTPStatus

from flask import Blueprint, jsonify, request

from application import emergency as emergency_app
from domain.validators import (
  coordenadas_validas,
  telefone_valido,
  verificar_campos,
)
from infrastructure.twilio import client as twilio_client
from presentation.http.auth import get_bearer_user_id
from presentation.http.responses import resposta_api

bp = Blueprint('emergency', __name__)


@bp.route('/ligacao-emergencia', methods=['POST'])
def ligacao_emergencia():
  dados = request.get_json(silent=True) or {}
  numero = dados.get('numero')
  latitude = dados.get('latitude')
  longitude = dados.get('longitude')
  nome = dados.get('nome')
  cidade_raw = dados.get('cidade')
  gps_indisponivel = bool(dados.get('gps_indisponivel'))

  campo = verificar_campos(numero, latitude, longitude, nome)

  if campo:
    codigo = HTTPStatus.BAD_REQUEST
    return jsonify(resposta_api(codigo, f"O campo '{campo}' é obrigatório.")), codigo

  if not coordenadas_validas(latitude, longitude, gps_indisponivel):
    codigo = HTTPStatus.BAD_REQUEST
    return (
      jsonify(
        resposta_api(
          codigo,
          'Coordenadas inválidas. Latitude deve estar entre -90 e 90, e longitude entre -180 e 180.',
        )
      ),
      codigo,
    )

  if not telefone_valido(numero):
    codigo = HTTPStatus.BAD_REQUEST
    return (
      jsonify(
        resposta_api(
          codigo,
          'Número inválido, verifique se é uma str e use o formato internacional: ex. +5511999999999',
        )
      ),
      codigo,
    )

  cidade = (
    cidade_raw.strip()
    if isinstance(cidade_raw, str) and cidade_raw.strip()
    else ('Localização indisponível' if gps_indisponivel else '')
  )

  ticket = emergency_app.create_ticket(
    nome=str(nome).strip(),
    telefone=str(numero).strip(),
    prioridade='ALTA',
    user_id=get_bearer_user_id(),
    latitude=float(latitude),
    longitude=float(longitude),
    cidade=cidade,
  )

  twilio_result = twilio_client.fazer_ligacao(
    numero, latitude, longitude, nome, gps_indisponivel
  )

  codigo = HTTPStatus.CREATED
  payload = {
    **resposta_api(
      codigo,
      f'Emergência registrada. Chamado #{ticket["id"]} criado na central.',
    ),
    'chamado': ticket,
    'twilio': {
      'status': bool(twilio_result.get('status')),
      'erro': None
      if twilio_result.get('status')
      else str(twilio_result.get('data')),
    },
  }
  return jsonify(payload), codigo
