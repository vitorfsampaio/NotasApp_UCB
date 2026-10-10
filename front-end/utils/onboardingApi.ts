import { getApiBaseUrl } from '@/constants/config';
import { isMainFocus, isUsageType } from '@/constants/userPreferences';
import type { AuthUser } from '@/types';

interface OnboardingPayload {
  codigo: number;
  mensagem: string;
  onboardingCompleted?: boolean;
  usuario?: {
    id: number;
    username: string;
    fullName?: string;
    onboardingCompleted?: boolean;
    usageType?: string | null;
    mainFocus?: string | null;
  };
}

async function parseResponse(response: Response): Promise<OnboardingPayload> {
  const text = await response.text();
  try {
    return JSON.parse(text) as OnboardingPayload;
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
}

export async function fetchOnboardingStatus(token: string): Promise<boolean> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/onboarding`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseResponse(response);
  if (!response.ok || typeof data.onboardingCompleted !== 'boolean') {
    throw new Error(data.mensagem || 'Não foi possível carregar o onboarding.');
  }
  return data.onboardingCompleted;
}

export async function completeOnboardingRequest(
  token: string,
): Promise<AuthUser> {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/api/onboarding/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseResponse(response);
  if (!response.ok || !data.usuario) {
    throw new Error(data.mensagem || 'Não foi possível concluir o onboarding.');
  }
  return {
    id: data.usuario.id,
    username: data.usuario.username,
    fullName: data.usuario.fullName ?? '',
    onboardingCompleted: Boolean(data.usuario.onboardingCompleted),
    usageType: isUsageType(data.usuario.usageType)
      ? data.usuario.usageType
      : null,
    mainFocus: isMainFocus(data.usuario.mainFocus)
      ? data.usuario.mainFocus
      : null,
  };
}
