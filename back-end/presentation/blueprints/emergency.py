from flask import Blueprint, jsonify, request
from http import HTTPStatus

from domain.validators import (
  coordenadas_validas,
  telefone_valido,
  verificar_campos,
)
from infrastructure.twilio import client as twilio_client
from presentation.http.responses import resposta_api

bp = Blueprint('emergency', __name__)


@bp.route('/ligacao-emergencia', methods=['POST'])
def ligacao_emergencia():
  dados = request.get_json()
  numero = dados.get('numero')
  latitude = dados.get('latitude')
  longitude = dados.get('longitude')
  nome = dados.get('nome')
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

  data = twilio_client.fazer_ligacao(
    numero, latitude, longitude, nome, gps_indisponivel
  )

  if not data['status']:
    codigo = HTTPStatus.INTERNAL_SERVER_ERROR
    return (
      jsonify(
        resposta_api(
          codigo,
          f"Erro ao tentar ligar ou mandar sms. Erro: {data['data']}",
        )
      ),
      codigo,
    )

  codigo = HTTPStatus.CREATED
  return (
    jsonify(
      resposta_api(
        codigo,
        f'Ligacao de emergencia para o numero {numero} foi um sucesso.',
      )
    ),
    codigo,
  )
