# Planify

## O que o projeto faz

Na superfície, o Planify parece um **bloco de notas / organizador pessoal convencional**:

- Notas
- Tarefas do dia
- Agenda e eventos com lembretes
- Projetos com progresso
- Login, cadastro e perfil

Por trás disso, existe uma **função oculta de emergência**:

- Nas configurações de segurança (acesso secreto pelo header), o usuário define uma **palavra-chave**
- Quando essa palavra é digitada em uma nota, o app pode acionar ações silenciosas de emergência
- Com integração Twilio, o sistema pode **enviar SMS com localização** e fazer **ligação automática** para contatos de emergência

## Tecnologias

- **Front-end:** Expo, React Native, TypeScript
- **Back-end:** Python, Flask
- **Banco:** PostgreSQL 16
- **Infra local:** Docker / Docker Compose
- **Emergência:** Twilio

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e aberto
- Node.js (LTS) + npm
- Emulador Android/iOS ou Expo Go (para testar o app)

## 1) Back-end + banco com Docker

Na raiz do projeto:

```bash
cd NotasApp_NovasTecnologias
```

Crie o arquivo `back-end/.env` (pode copiar de `back-end/.env.exemple`):

```env
ACCOUNT_SID =
AUTH_TOKEN =
TWILIO_NUMBER =
MY_NUMBER =
JWT_SECRET = planify-local-dev-secret
DATABASE_URL = postgresql://planify:planify@localhost:5432/notas_app
```

> As variáveis Twilio são necessárias só para a função de emergência. O resto do app funciona sem elas.  
> Com Docker, o `DATABASE_URL` do container aponta automaticamente para o serviço `db`.

Suba banco + API:

```bash
docker compose up --build
```

Serviços:

| Serviço  | URL / conexão |
|----------|----------------|
| API Flask | `http://localhost:5000` |
| Postgres  | `postgresql://planify:planify@localhost:5432/notas_app` |

Comandos úteis:

```bash
docker compose up --build
docker compose down
docker compose down -v
docker compose logs -f backend
```

- `down` para os containers  
- `down -v` também apaga o volume do banco

## 2) Front-end

Em outro terminal:

```bash
cd NotasApp_NovasTecnologias/front-end
npm install
```

Configure o endereço da API em `front-end/app.json` → `extra.apiBaseUrl`:

- Emulador Android / celular na mesma Wi-Fi: use o IP do seu Mac  
  Exemplo: `"apiBaseUrl": "http://192.168.1.8:5000"`
- Descubra o IP: `ipconfig getifaddr en0`

Rodar:

```bash
npm start
```

Ou:

```bash
npm run android
npm run ios
npm run web
```

> Se o IP da máquina mudar (troca de rede), atualize o `apiBaseUrl` e, no Android, faça um build limpo se a URL antiga continuar gravada no app.

## Fluxo recomendado para outros devs

1. Abrir o Docker Desktop  
2. Na raiz: `docker compose up --build`  
3. Em `front-end`: `npm install` e `npm start` / `npm run android`  
4. Apontar o `apiBaseUrl` para o IP do Mac na porta `5000`

## Endpoint de emergência (Twilio)

`POST /api/ligacao-emergencia`

```json
{
  "nome": "alda",
  "numero": "+5561986310265",
  "latitude": -41.20,
  "longitude": -1.00
}
```

Campos:

- `nome`: string  
- `numero`: string (formato internacional)  
- `latitude`: float  
- `longitude`: float  

Credenciais Twilio: [twilio.com](https://www.twilio.com/pt-br)
