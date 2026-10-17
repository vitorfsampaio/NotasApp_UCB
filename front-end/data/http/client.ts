import { getApiBaseUrl } from '@/constants/config';

export interface ApiMessage {
  codigo: number;
  mensagem: string;
}

export function getBaseUrl(): string {
  return getApiBaseUrl();
}

export function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function jsonHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

export async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

export async function requestJson<T extends ApiMessage>(
  path: string,
  init: RequestInit,
  fallbackMessage: string
): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${getBaseUrl()}${path}`, init);
  const data = await parseJson<T>(response);
  if (!response.ok) {
    throw new Error(data.mensagem || fallbackMessage);
  }
  return { response, data };
}
