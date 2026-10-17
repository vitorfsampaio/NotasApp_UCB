from flask import Blueprint, jsonify
from http import HTTPStatus

from application import auth as auth_app
from presentation.http.auth import require_auth
from presentation.http.responses import resposta_api

bp = Blueprint('onboarding', __name__)


@bp.route('', methods=['GET'], strict_slashes=False)
@require_auth
def get_onboarding(user_id: int):
  status = auth_app.get_onboarding_status(user_id)
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
  user = auth_app.complete_onboarding(user_id)
  if user is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Usuário não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Onboarding concluído com sucesso.'),
        'usuario': auth_app.serialize_user(user),
        'onboardingCompleted': True,
      }
    ),
    code,
  )
