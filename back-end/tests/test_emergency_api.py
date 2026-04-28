import os
from unittest.mock import MagicMock, patch

os.environ.setdefault('ACCOUNT_SID', 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
os.environ.setdefault('AUTH_TOKEN', 'test_auth_token')
os.environ.setdefault('TWILIO_NUMBER', '+15555555555')
os.environ.setdefault('MY_NUMBER', '+15555555555')

from app import app


def test_tc05_valid_coords_two_contacts_mock_returns_201():
    ok = {'status': True, 'call': MagicMock(), 'message': MagicMock()}
    with patch('twilio_service.fazer_ligacao', return_value=ok):
        client = app.test_client()
        res = client.post(
            '/api/ligacao-emergencia',
            json={
                'numero': '+5511999999999',
                'latitude': -23.55,
                'longitude': -46.63,
                'nome': 'Usuario',
                'gps_indisponivel': False,
            },
        )
        assert res.status_code == 201


def test_tc06_gps_indisponivel_zero_zero():
    ok = {'status': True, 'call': MagicMock(), 'message': MagicMock()}
    with patch('twilio_service.fazer_ligacao', return_value=ok):
        client = app.test_client()
        res = client.post(
            '/api/ligacao-emergencia',
            json={
                'numero': '+5511999999999',
                'latitude': 0,
                'longitude': 0,
                'nome': 'Usuario',
                'gps_indisponivel': True,
            },
        )
        assert res.status_code == 201


def test_tc07_api_retorna_500_quando_twilio_falha_totalmente():
    fail = {'status': False, 'data': Exception('503')}
    with patch('twilio_service.fazer_ligacao', return_value=fail):
        client = app.test_client()
        res = client.post(
            '/api/ligacao-emergencia',
            json={
                'numero': '+5511999999999',
                'latitude': -10.0,
                'longitude': -20.0,
                'nome': 'Usuario',
                'gps_indisponivel': False,
            },
        )
        assert res.status_code == 500
