import { getBaseUrl } from '@/data/http/client';
import type { EventIcon, PartialPlannerEvent, PlannerEvent } from '@/domain/models';

interface ApiEventPayload {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: EventIcon;
  startsAt: string;
  durationMinutes: number;
  reminderMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiEventsResponse {
  codigo: number;
  mensagem: string;
  eventos?: ApiEventPayload[];
  evento?: ApiEventPayload;
}

function mapEvent(payload: ApiEventPayload): PlannerEvent {
  return {
    id: payload.id,
    title: payload.title,
    category: payload.category,
    description: payload.description,
    icon: payload.icon,
    startsAt: new Date(payload.startsAt),
    durationMinutes: payload.durationMinutes,
    reminderMinutes: payload.reminderMinutes,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

async function parseEventsResponse(
  response: Response
): Promise<ApiEventsResponse> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiEventsResponse;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function serializeEvent(eventData: Partial<PartialPlannerEvent>) {
  return {
    ...eventData,
    startsAt: eventData.startsAt ? eventData.startsAt.toISOString() : undefined,
  };
}

export async function fetchEvents(token: string): Promise<PlannerEvent[]> {
  const response = await fetch(`${getBaseUrl()}/api/events`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseEventsResponse(response);
  if (!response.ok || !data.eventos) {
    throw new Error(data.mensagem || 'Não foi possível carregar os eventos.');
  }
  return data.eventos.map(mapEvent);
}

export async function createEventRequest(
  token: string,
  eventData: PartialPlannerEvent
): Promise<PlannerEvent> {
  const response = await fetch(`${getBaseUrl()}/api/events`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(serializeEvent(eventData)),
  });
  const data = await parseEventsResponse(response);
  if (!response.ok || !data.evento) {
    throw new Error(data.mensagem || 'Não foi possível criar o evento.');
  }
  return mapEvent(data.evento);
}

export async function updateEventRequest(
  token: string,
  id: string,
  eventData: Partial<PartialPlannerEvent>
): Promise<PlannerEvent> {
  const response = await fetch(`${getBaseUrl()}/api/events/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(serializeEvent(eventData)),
  });
  const data = await parseEventsResponse(response);
  if (!response.ok || !data.evento) {
    throw new Error(data.mensagem || 'Não foi possível atualizar o evento.');
  }
  return mapEvent(data.evento);
}

export async function deleteEventRequest(
  token: string,
  id: string
): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/api/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseEventsResponse(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível excluir o evento.');
  }
}
