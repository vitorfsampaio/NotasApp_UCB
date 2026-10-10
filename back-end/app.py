from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request
from flask_cors import CORS
from util import resposta_api, coordenadas_validas, telefone_valido, verificar_campos
from http import HTTPStatus
import twilio_service

from auth_blueprint import bp as auth_bp
from notes_blueprint import bp as notes_bp
from onboarding_blueprint import bp as onboarding_bp
from tasks_blueprint import bp as tasks_bp
from events_blueprint import bp as events_bp
from projects_blueprint import bp as projects_bp
from database import init_db

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
init_db()
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(notes_bp, url_prefix='/api/notes')
app.register_blueprint(onboarding_bp, url_prefix='/api/onboarding')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(projects_bp, url_prefix='/api/projects')

@app.route('/api/ligacao-emergencia', methods=['POST'])
def ligacao_emergencia():
    dados = request.get_json()
    numero = dados.get("numero")
    latitude = dados.get("latitude")
    longitude = dados.get("longitude")
    nome = dados.get("nome")
    gps_indisponivel = bool(dados.get("gps_indisponivel"))

    campo = verificar_campos(numero, latitude, longitude, nome)

    if campo:
        codigo = HTTPStatus.BAD_REQUEST
        return jsonify(resposta_api(codigo, f"O campo '{campo}' é obrigatório.")), codigo

    if not coordenadas_validas(latitude, longitude, gps_indisponivel):
        codigo = HTTPStatus.BAD_REQUEST
        return jsonify(resposta_api(codigo, 'Coordenadas inválidas. Latitude deve estar entre -90 e 90, e longitude entre -180 e 180.')), codigo

    if not telefone_valido(numero) :
        codigo = HTTPStatus.BAD_REQUEST
        return jsonify(resposta_api(codigo, "Número inválido, verifique se é uma str e use o formato internacional: ex. +5511999999999")), codigo

    data = twilio_service.fazer_ligacao(numero, latitude, longitude, nome, gps_indisponivel)

    if not data["status"]:
        codigo = HTTPStatus.INTERNAL_SERVER_ERROR
        return jsonify(resposta_api(codigo, f"Erro ao tentar ligar ou mandar sms. Erro: {data['data']}")), codigo

    codigo = HTTPStatus.CREATED
    return jsonify(resposta_api(codigo, f"Ligacao de emergencia para o numero {numero} foi um sucesso.")), codigo


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
