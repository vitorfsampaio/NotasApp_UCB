import { getBaseUrl } from '@/data/http/client';
import { isMainFocus, isUsageType } from '@/constants/userPreferences';
import { isSubscriptionPlan } from '@/constants/plans';
import type { AuthUser, SubscriptionPlan } from '@/domain/models';

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
    plan?: string | null;
  };
}

function mapUsuario(
  raw: NonNullable<OnboardingPayload['usuario']>
): AuthUser {
  return {
    id: raw.id,
    username: raw.username,
    fullName: raw.fullName ?? '',
    onboardingCompleted: Boolean(raw.onboardingCompleted),
    usageType: isUsageType(raw.usageType) ? raw.usageType : null,
    mainFocus: isMainFocus(raw.mainFocus) ? raw.mainFocus : null,
    plan: isSubscriptionPlan(raw.plan) ? raw.plan : null,
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
  const base = getBaseUrl();
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
  token: string
): Promise<AuthUser> {
  const base = getBaseUrl();
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
  return mapUsuario(data.usuario);
}

export async function selectPlanRequest(
  token: string,
  plan: SubscriptionPlan
): Promise<AuthUser> {
  const base = getBaseUrl();
  const response = await fetch(`${base}/api/onboarding/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });
  const data = await parseResponse(response);
  if (!response.ok || !data.usuario) {
    throw new Error(data.mensagem || 'Não foi possível selecionar o plano.');
  }
  return mapUsuario(data.usuario);
}
