from __future__ import annotations

from datetime import datetime, timezone

from infrastructure.database.connection import get_connection

SEED_TICKETS = [
  {
    'id': 1,
    'nome': 'Maria Silva',
    'telefone': '+5561999990001',
    'prioridade': 'ALTA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'Brasília, DF',
    'created_at': datetime(2026, 10, 17, 14, 20, tzinfo=timezone.utc),
  },
  {
    'id': 2,
    'nome': 'Ana Souza',
    'telefone': '+5561999990002',
    'prioridade': 'MEDIA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Belo Horizonte, MG',
    'created_at': datetime(2026, 10, 17, 18, 5, tzinfo=timezone.utc),
  },
  {
    'id': 3,
    'nome': 'Julia Costa',
    'telefone': '+5561999990003',
    'prioridade': 'ALTA',
    'status': 'RESOLVIDO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Brasília, DF',
    'created_at': datetime(2026, 10, 18, 9, 40, tzinfo=timezone.utc),
  },
  {
    'id': 4,
    'nome': 'Beatriz Oliveira',
    'telefone': '+5561999990004',
    'prioridade': 'BAIXA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Goiânia, GO',
    'created_at': datetime(2026, 10, 18, 16, 10, tzinfo=timezone.utc),
  },
  {
    'id': 5,
    'nome': 'Camila Santos',
    'telefone': '+5561999990005',
    'prioridade': 'ALTA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Goiânia, GO',
    'created_at': datetime(2026, 10, 19, 11, 15, tzinfo=timezone.utc),
  },
  {
    'id': 6,
    'nome': 'Larissa Almeida',
    'telefone': '+5561999990006',
    'prioridade': 'MEDIA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'São Paulo, SP',
    'created_at': datetime(2026, 10, 19, 20, 30, tzinfo=timezone.utc),
  },
  {
    'id': 20,
    'nome': 'Patrícia Nogueira',
    'telefone': '+5561999990020',
    'prioridade': 'ALTA',
    'status': 'RESOLVIDO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Salvador, BA',
    'created_at': datetime(2026, 10, 17, 21, 12, tzinfo=timezone.utc),
  },
  {
    'id': 21,
    'nome': 'Renata Dias',
    'telefone': '+5561999990021',
    'prioridade': 'MEDIA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Curitiba, PR',
    'created_at': datetime(2026, 10, 18, 13, 45, tzinfo=timezone.utc),
  },
  {
    'id': 22,
    'nome': 'Fernanda Rocha',
    'telefone': '+5561999990022',
    'prioridade': 'BAIXA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Recife, PE',
    'created_at': datetime(2026, 10, 18, 22, 5, tzinfo=timezone.utc),
  },
  {
    'id': 23,
    'nome': 'Amanda Ferreira',
    'telefone': '+5561999990023',
    'prioridade': 'ALTA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'Fortaleza, CE',
    'created_at': datetime(2026, 10, 19, 8, 25, tzinfo=timezone.utc),
  },
  {
    'id': 24,
    'nome': 'Isabela Martins',
    'telefone': '+5561999990024',
    'prioridade': 'MEDIA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Manaus, AM',
    'created_at': datetime(2026, 10, 20, 10, 50, tzinfo=timezone.utc),
  },
  {
    'id': 25,
    'nome': 'Tatiane Lopes',
    'telefone': '+5561999990025',
    'prioridade': 'ALTA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Porto Alegre, RS',
    'created_at': datetime(2026, 10, 20, 15, 18, tzinfo=timezone.utc),
  },
  {
    'id': 26,
    'nome': 'Bruna Carvalho',
    'telefone': '+5561999990026',
    'prioridade': 'BAIXA',
    'status': 'RESOLVIDO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Belém, PA',
    'created_at': datetime(2026, 10, 20, 19, 40, tzinfo=timezone.utc),
  },
  {
    'id': 27,
    'nome': 'Carla Mendes',
    'telefone': '+5561999990027',
    'prioridade': 'ALTA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'Florianópolis, SC',
    'created_at': datetime(2026, 10, 21, 9, 5, tzinfo=timezone.utc),
  },
  {
    'id': 28,
    'nome': 'Daniela Pires',
    'telefone': '+5561999990028',
    'prioridade': 'MEDIA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Vitória, ES',
    'created_at': datetime(2026, 10, 21, 12, 33, tzinfo=timezone.utc),
  },
  {
    'id': 29,
    'nome': 'Eliane Barbosa',
    'telefone': '+5561999990029',
    'prioridade': 'ALTA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Natal, RN',
    'created_at': datetime(2026, 10, 21, 17, 55, tzinfo=timezone.utc),
  },
  {
    'id': 30,
    'nome': 'Gabriela Teixeira',
    'telefone': '+5561999990030',
    'prioridade': 'MEDIA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'João Pessoa, PB',
    'created_at': datetime(2026, 10, 22, 8, 12, tzinfo=timezone.utc),
  },
  {
    'id': 31,
    'nome': 'Helena Castro',
    'telefone': '+5561999990031',
    'prioridade': 'BAIXA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Maceió, AL',
    'created_at': datetime(2026, 10, 22, 11, 48, tzinfo=timezone.utc),
  },
  {
    'id': 32,
    'nome': 'Ingrid Ramos',
    'telefone': '+5561999990032',
    'prioridade': 'ALTA',
    'status': 'RESOLVIDO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Teresina, PI',
    'created_at': datetime(2026, 10, 22, 16, 22, tzinfo=timezone.utc),
  },
  {
    'id': 33,
    'nome': 'Jéssica Azevedo',
    'telefone': '+5561999990033',
    'prioridade': 'ALTA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'Campo Grande, MS',
    'created_at': datetime(2026, 10, 22, 21, 10, tzinfo=timezone.utc),
  },
  {
    'id': 34,
    'nome': 'Karina Duarte',
    'telefone': '+5561999990034',
    'prioridade': 'MEDIA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'Cuiabá, MT',
    'created_at': datetime(2026, 10, 23, 7, 35, tzinfo=timezone.utc),
  },
  {
    'id': 35,
    'nome': 'Lívia Monteiro',
    'telefone': '+5561999990035',
    'prioridade': 'ALTA',
    'status': 'NOVO',
    'responsavel': None,
    'cidade': 'Palmas, TO',
    'created_at': datetime(2026, 10, 23, 10, 15, tzinfo=timezone.utc),
  },
  {
    'id': 36,
    'nome': 'Marina Figueiredo',
    'telefone': '+5561999990036',
    'prioridade': 'BAIXA',
    'status': 'RESOLVIDO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Aracaju, SE',
    'created_at': datetime(2026, 10, 23, 13, 40, tzinfo=timezone.utc),
  },
  {
    'id': 37,
    'nome': 'Natália Correia',
    'telefone': '+5561999990037',
    'prioridade': 'MEDIA',
    'status': 'RESOLVIDO',
    'responsavel': 'Carolina Mendes',
    'cidade': 'São Luís, MA',
    'created_at': datetime(2026, 10, 23, 15, 55, tzinfo=timezone.utc),
  },
  {
    'id': 38,
    'nome': 'Olívia Mendes',
    'telefone': '+5561999990038',
    'prioridade': 'ALTA',
    'status': 'EM_ATENDIMENTO',
    'responsavel': 'Fernanda Alves',
    'cidade': 'Rio de Janeiro, RJ',
    'created_at': datetime(2026, 10, 23, 18, 20, tzinfo=timezone.utc),
  },
]

SEED_ATTENDANCES = [
  {
    'id': 1,
    'ticket_id': 2,
    'nome': 'Ana Souza',
    'responsavel': 'Carolina Mendes',
    'started_at': datetime(2026, 10, 17, 18, 20, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
  {
    'id': 2,
    'ticket_id': 3,
    'nome': 'Julia Costa',
    'responsavel': 'Fernanda Alves',
    'started_at': datetime(2026, 10, 18, 9, 50, tzinfo=timezone.utc),
    'ended_at': datetime(2026, 10, 18, 10, 30, tzinfo=timezone.utc),
    'status': 'FINALIZADO',
  },
  {
    'id': 3,
    'ticket_id': 4,
    'nome': 'Beatriz Oliveira',
    'responsavel': 'Carolina Mendes',
    'started_at': datetime(2026, 10, 18, 16, 20, tzinfo=timezone.utc),
    'ended_at': datetime(2026, 10, 18, 16, 50, tzinfo=timezone.utc),
    'status': 'FINALIZADO',
  },
  {
    'id': 4,
    'ticket_id': 5,
    'nome': 'Camila Santos',
    'responsavel': 'Fernanda Alves',
    'started_at': datetime(2026, 10, 19, 11, 30, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
  {
    'id': 20,
    'ticket_id': 24,
    'nome': 'Isabela Martins',
    'responsavel': 'Fernanda Alves',
    'started_at': datetime(2026, 10, 20, 11, 10, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
  {
    'id': 21,
    'ticket_id': 29,
    'nome': 'Eliane Barbosa',
    'responsavel': 'Fernanda Alves',
    'started_at': datetime(2026, 10, 21, 18, 10, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
  {
    'id': 22,
    'ticket_id': 34,
    'nome': 'Karina Duarte',
    'responsavel': 'Carolina Mendes',
    'started_at': datetime(2026, 10, 23, 7, 50, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
  {
    'id': 23,
    'ticket_id': 38,
    'nome': 'Olívia Mendes',
    'responsavel': 'Fernanda Alves',
    'started_at': datetime(2026, 10, 23, 18, 35, tzinfo=timezone.utc),
    'ended_at': None,
    'status': 'EM_ANDAMENTO',
  },
]


def seed_emergency_data() -> None:
  conn = get_connection()
  try:
    with conn.cursor() as cur:
      for ticket in SEED_TICKETS:
        cur.execute(
          """
          INSERT INTO emergency_tickets (
            id, nome, telefone, prioridade, status, responsavel,
            cidade, created_at, updated_at
          )
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
          ON CONFLICT (id) DO NOTHING
          """,
          (
            ticket['id'],
            ticket['nome'],
            ticket['telefone'],
            ticket['prioridade'],
            ticket['status'],
            ticket['responsavel'],
            ticket['cidade'],
            ticket['created_at'],
            ticket['created_at'],
          ),
        )

      for attendance in SEED_ATTENDANCES:
        cur.execute(
          """
          INSERT INTO emergency_attendances (
            id, ticket_id, nome, responsavel, started_at, ended_at, status
          )
          VALUES (%s, %s, %s, %s, %s, %s, %s)
          ON CONFLICT (id) DO NOTHING
          """,
          (
            attendance['id'],
            attendance['ticket_id'],
            attendance['nome'],
            attendance['responsavel'],
            attendance['started_at'],
            attendance['ended_at'],
            attendance['status'],
          ),
        )

      cur.execute(
        """
        SELECT setval(
          pg_get_serial_sequence('emergency_tickets', 'id'),
          (SELECT COALESCE(MAX(id), 1) FROM emergency_tickets)
        )
        """
      )
      cur.execute(
        """
        SELECT setval(
          pg_get_serial_sequence('emergency_attendances', 'id'),
          (SELECT COALESCE(MAX(id), 1) FROM emergency_attendances)
        )
        """
      )
    conn.commit()
  finally:
    conn.close()
