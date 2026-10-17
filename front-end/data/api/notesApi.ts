import type { Note, PartialNote } from '@/domain/models';
import { authHeaders, getBaseUrl, parseJson } from '@/data/http/client';

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

export async function fetchNotes(token: string): Promise<Note[]> {
  const response = await fetch(`${getBaseUrl()}/api/notes`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiNotesResponse>(response);
  if (!response.ok || !data.notas) {
    throw new Error(data.mensagem || 'Não foi possível carregar as notas.');
  }
  return data.notas.map(mapNote);
}

export async function fetchNoteById(token: string, id: string): Promise<Note> {
  const response = await fetch(`${getBaseUrl()}/api/notes/${id}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiNotesResponse>(response);
  if (!response.ok || !data.nota) {
    throw new Error(data.mensagem || 'Nota não encontrada.');
  }
  return mapNote(data.nota);
}

export async function createNoteRequest(
  token: string,
  noteData: PartialNote
): Promise<Note> {
  const response = await fetch(`${getBaseUrl()}/api/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      title: noteData.title,
      content: noteData.content,
    }),
  });
  const data = await parseJson<ApiNotesResponse>(response);
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
  const response = await fetch(`${getBaseUrl()}/api/notes/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(noteData),
  });
  const data = await parseJson<ApiNotesResponse>(response);
  if (!response.ok || !data.nota) {
    throw new Error(data.mensagem || 'Não foi possível atualizar a nota.');
  }
  return mapNote(data.nota);
}

export async function deleteNoteRequest(token: string, id: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/api/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiNotesResponse>(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível excluir a nota.');
  }
}
