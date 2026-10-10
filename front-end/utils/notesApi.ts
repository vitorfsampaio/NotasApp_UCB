import { getApiBaseUrl } from '@/constants/config';
import type { Note, PartialNote } from '@/types';

interface ApiNotePayload {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiNotesResponse {
  codigo: number;
  mensagem: string;
  notas?: ApiNotePayload[];
  nota?: ApiNotePayload;
}

function mapNote(payload: ApiNotePayload): Note {
  return {
    id: payload.id,
    title: payload.title,
    content: payload.content,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

async function parseNotesResponse(response: Response): Promise<ApiNotesResponse> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiNotesResponse;
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

export async function fetchNotes(token: string): Promise<Note[]> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/notes`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseNotesResponse(response);
  if (!response.ok || !data.notas) {
    throw new Error(data.mensagem || 'Não foi possível carregar as notas.');
  }
  return data.notas.map(mapNote);
}

export async function fetchNoteById(token: string, id: string): Promise<Note> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/notes/${id}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseNotesResponse(response);
  if (!response.ok || !data.nota) {
    throw new Error(data.mensagem || 'Nota não encontrada.');
  }
  return mapNote(data.nota);
}

export async function createNoteRequest(
  token: string,
  noteData: PartialNote
): Promise<Note> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      title: noteData.title,
      content: noteData.content,
    }),
  });
  const data = await parseNotesResponse(response);
  if (!response.ok || !data.nota) {
    throw new Error(data.mensagem || 'Não foi possível criar a nota.');
  }
  return mapNote(data.nota);
}

export async function updateNoteRequest(
  token: string,
  id: string,
  noteData: Partial<PartialNote>
): Promise<Note> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/notes/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(noteData),
  });
  const data = await parseNotesResponse(response);
  if (!response.ok || !data.nota) {
    throw new Error(data.mensagem || 'Não foi possível atualizar a nota.');
  }
  return mapNote(data.nota);
}

export async function deleteNoteRequest(token: string, id: string): Promise<void> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseNotesResponse(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível excluir a nota.');
  }
}
