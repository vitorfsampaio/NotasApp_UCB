import os
from unittest.mock import MagicMock, patch

os.environ.setdefault('ACCOUNT_SID', 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
os.environ.setdefault('AUTH_TOKEN', 'test_auth_token')
os.environ.setdefault('TWILIO_NUMBER', '+15555555555')
os.environ.setdefault('MY_NUMBER', '+15555555555')

import twilio_service


def test_tc07_tres_tentativas_com_pausa_de_3s():
    mock_client = MagicMock()
    mock_client.calls.create.side_effect = [
        Exception('503'),
        Exception('503'),
        MagicMock(),
    ]
    mock_client.messages.create.return_value = MagicMock()
    with patch.object(twilio_service, 'client', mock_client):
        with patch('twilio_service.time.sleep') as sleep_mock:
            out = twilio_service.fazer_ligacao(
                '+5511999999999',
                -23.5,
                -46.6,
                'Teste',
                False,
            )
    assert out['status'] is True
    assert sleep_mock.call_count == 2
    assert sleep_mock.call_args_list[0][0][0] == 3


def test_tc07_tres_falhas_retorna_erro():
    mock_client = MagicMock()
    mock_client.calls.create.side_effect = [
        Exception('503'),
        Exception('503'),
        Exception('503'),
    ]
    mock_client.messages.create.return_value = MagicMock()
    with patch.object(twilio_service, 'client', mock_client):
        with patch('twilio_service.time.sleep') as sleep_mock:
            out = twilio_service.fazer_ligacao(
                '+5511999999999',
                -23.5,
                -46.6,
                'Teste',
                False,
            )
    assert out['status'] is False
    assert sleep_mock.call_count == 2

