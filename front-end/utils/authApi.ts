import { getApiBaseUrl } from '@/constants/config';
import { isMainFocus, isUsageType } from '@/constants/userPreferences';
import type { AuthSession, AuthUser, MainFocus, UsageType } from '@/types';

interface ApiAuthPayload {
  codigo: number;
  mensagem: string;
  token?: string;
  usuario?: {
    id: number;
    username: string;
    fullName?: string;
    onboardingCompleted?: boolean;
    usageType?: string | null;
    mainFocus?: string | null;
  };
}

function mapUsuario(raw: NonNullable<ApiAuthPayload['usuario']>): AuthUser {
  return {
    id: raw.id,
    username: raw.username,
    fullName: raw.fullName ?? '',
    onboardingCompleted: Boolean(raw.onboardingCompleted),
    usageType: isUsageType(raw.usageType) ? raw.usageType : null,
    mainFocus: isMainFocus(raw.mainFocus) ? raw.mainFocus : null,
  };
}

async function parseAuthResponse(response: Response): Promise<ApiAuthPayload> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiAuthPayload;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<AuthSession> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await parseAuthResponse(response);
  if (!response.ok || !data.token || !data.usuario) {
    throw new Error(data.mensagem || 'Não foi possível entrar.');
  }
  return { token: data.token, usuario: mapUsuario(data.usuario) };
}

export async function registerRequest(
  username: string,
  password: string,
  fullName: string,
  usageType: UsageType,
  mainFocus: MainFocus,
): Promise<AuthSession> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      fullName,
      usageType,
      mainFocus,
    }),
  });
  const data = await parseAuthResponse(response);
  if (!response.ok || !data.token || !data.usuario) {
    throw new Error(data.mensagem || 'Não foi possível criar a conta.');
  }
  return { token: data.token, usuario: mapUsuario(data.usuario) };
}
