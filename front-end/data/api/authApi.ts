import { isMainFocus, isUsageType } from '@/constants/userPreferences';
import type { AuthSession, AuthUser, MainFocus, UsageType } from '@/domain/models';
import {
  getBaseUrl,
  jsonHeaders,
  parseJson,
} from '@/data/http/client';

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

export async function loginRequest(
  username: string,
  password: string
): Promise<AuthSession> {
  const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
  const data = await parseJson<ApiAuthPayload>(response);
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
  mainFocus: MainFocus
): Promise<AuthSession> {
  const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      username,
      password,
      fullName,
      usageType,
      mainFocus,
    }),
  });
  const data = await parseJson<ApiAuthPayload>(response);
  if (!response.ok || !data.token || !data.usuario) {
    throw new Error(data.mensagem || 'Não foi possível criar a conta.');
  }
  return { token: data.token, usuario: mapUsuario(data.usuario) };
}
