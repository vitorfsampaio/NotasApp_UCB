from flask import Blueprint, jsonify
from http import HTTPStatus

from auth_service import (
  complete_onboarding,
  get_onboarding_status,
  require_auth,
  serialize_user,
)
from util import resposta_api

bp = Blueprint('onboarding', __name__)


@bp.route('', methods=['GET'], strict_slashes=False)
@require_auth
def get_onboarding(user_id: int):
  status = get_onboarding_status(user_id)
  if status is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Usuário não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Status do onboarding carregado.'),
        'onboardingCompleted': status,
      }
    ),
    code,
  )


@bp.route('/complete', methods=['POST'], strict_slashes=False)
@require_auth
def post_complete_onboarding(user_id: int):
  user = complete_onboarding(user_id)
  if user is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Usuário não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Onboarding concluído com sucesso.'),
        'usuario': serialize_user(user),
        'onboardingCompleted': True,
      }
    ),
    code,
  )
