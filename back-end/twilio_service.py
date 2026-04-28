import logging
import time

from twilio.rest import Client
from settings import *
from util import criar_link_maps

logger = logging.getLogger(__name__)

client = Client(ACCOUNT_SID, AUTH_TOKEN)

MAX_ATTEMPTS = 3
RETRY_DELAY_S = 3

def enviar_sms(numero, lat, log, nome, gps_indisponivel=False):
    if gps_indisponivel:
        body = (
            f"Alerta automático: GPS indisponível. Contato de emergência para {nome}. "
            "Localização em tempo real não pôde ser obtida."
        )
    else:
        maps = criar_link_maps(lat, log)
        body = (
            f"Este é um aviso automático. A última localização de {nome} foi registrada em:\n{maps}"
        )
    message = client.messages.create(
        body=body,
        from_=TWILIO_NUMBER,
        to=numero
    )
    return message

def fazer_ligacao(numero, lat, log, nome, gps_indisponivel=False):
    last_err = None
    for attempt in range(MAX_ATTEMPTS):
        try:
            call = client.calls.create(
                twiml=f"<Response><Say language='pt-BR'>Atenção. Este é um alerta de segurança automático. {nome} pode estar em perigo. A última localização foi enviada por mensagem. Verifique imediatamente. Repetindo: esta é uma chamada de emergência.</Say></Response>",
                to=numero,
                from_=TWILIO_NUMBER
            )

            message = enviar_sms(numero, lat, log, nome, gps_indisponivel)

            return {"status": True, "call": call, "message": message}

        except Exception as e:
            last_err = e
            logger.error(
                "Twilio falhou na tentativa %s de %s: %s",
                attempt + 1,
                MAX_ATTEMPTS,
                e,
            )
            if attempt < MAX_ATTEMPTS - 1:
                time.sleep(RETRY_DELAY_S)

    return {"status": False, "data": last_err}
