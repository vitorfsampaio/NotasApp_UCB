from flask import Blueprint, jsonify, request
from http import HTTPStatus

from application import auth as auth_app
from domain.models import SUBSCRIPTION_PLANS
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


@bp.route('/plan', methods=['POST'], strict_slashes=False)
@require_auth
def post_select_plan(user_id: int):
  data = request.get_json(silent=True) or {}
  plan_raw = data.get('plan')
  plan = plan_raw.strip() if isinstance(plan_raw, str) else ''

  if plan not in SUBSCRIPTION_PLANS:
    code = HTTPStatus.BAD_REQUEST
    return (
      jsonify(resposta_api(code, 'Escolha um plano válido: free, pro ou max.')),
      code,
    )

  user = auth_app.select_subscription_plan(user_id, plan)
  if user is None:
    code = HTTPStatus.NOT_FOUND
    return jsonify(resposta_api(code, 'Usuário não encontrado.')), code

  code = HTTPStatus.OK
  return (
    jsonify(
      {
        **resposta_api(code, 'Plano selecionado com sucesso.'),
        'usuario': auth_app.serialize_user(user),
      }
    ),
    code,
  )
