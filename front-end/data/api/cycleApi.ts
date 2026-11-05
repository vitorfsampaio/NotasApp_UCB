import type {
  CycleDailyLog,
  CycleFlow,
  CycleMood,
  CycleOverview,
  CyclePeriod,
  CycleSettings,
  PartialCycleLog,
  PartialCyclePeriod,
} from '@/domain/models';
import { authHeaders, getBaseUrl, parseJson } from '@/data/http/client';

interface ApiPeriodPayload {
  id: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiLogPayload {
  id: string;
  date: string;
  flow: string;
  mood: string;
  symptoms: string[];
  intimacy: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiOverviewPayload {
  settings: CycleSettings;
  periods: ApiPeriodPayload[];
  currentCycleDay: number | null;
  cycleLength: number;
  periodLength: number;
  phase: CycleOverview['phase'];
  daysUntilNextPeriod: number | null;
  nextPeriodStart: string | null;
  nextPeriodEnd: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  ovulationDate: string | null;
  currentCycleStart?: string | null;
  isPeriodToday: boolean;
  isFertileToday: boolean;
  predictionReady: boolean;
}

interface ApiCycleResponse {
  codigo: number;
  mensagem: string;
  overview?: ApiOverviewPayload;
  settings?: CycleSettings;
  periods?: ApiPeriodPayload[];
  period?: ApiPeriodPayload;
  logs?: ApiLogPayload[];
  log?: ApiLogPayload;
}

function mapPeriod(payload: ApiPeriodPayload): CyclePeriod {
  return {
    id: payload.id,
    startDate: payload.startDate,
    endDate: payload.endDate,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

function mapLog(payload: ApiLogPayload): CycleDailyLog {
  return {
    id: payload.id,
    date: payload.date,
    flow: (payload.flow || '') as CycleFlow,
    mood: (payload.mood || '') as CycleMood,
    symptoms: Array.isArray(payload.symptoms) ? payload.symptoms : [],
    intimacy: Boolean(payload.intimacy),
    notes: payload.notes || '',
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt),
  };
}

function mapOverview(payload: ApiOverviewPayload): CycleOverview {
  return {
    settings: payload.settings,
    periods: (payload.periods || []).map(mapPeriod),
    currentCycleDay: payload.currentCycleDay,
    cycleLength: payload.cycleLength,
    periodLength: payload.periodLength,
    phase: payload.phase,
    daysUntilNextPeriod: payload.daysUntilNextPeriod,
    nextPeriodStart: payload.nextPeriodStart,
    nextPeriodEnd: payload.nextPeriodEnd,
    fertileWindowStart: payload.fertileWindowStart,
    fertileWindowEnd: payload.fertileWindowEnd,
    ovulationDate: payload.ovulationDate,
    currentCycleStart: payload.currentCycleStart ?? null,
    isPeriodToday: payload.isPeriodToday,
    isFertileToday: payload.isFertileToday,
    predictionReady: payload.predictionReady,
  };
}

export async function fetchCycleOverview(token: string): Promise<{
  overview: CycleOverview;
  logs: CycleDailyLog[];
}> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/overview`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.overview) {
    throw new Error(data.mensagem || 'Não foi possível carregar o ciclo.');
  }
  return {
    overview: mapOverview(data.overview),
    logs: (data.logs || []).map(mapLog),
  };
}

export async function updateCycleSettingsRequest(
  token: string,
  settings: CycleSettings
): Promise<{ settings: CycleSettings; overview: CycleOverview }> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/settings`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(settings),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.settings || !data.overview) {
    throw new Error(
      data.mensagem || 'Não foi possível atualizar as configurações.'
    );
  }
  return {
    settings: data.settings,
    overview: mapOverview(data.overview),
  };
}

export async function createPeriodRequest(
  token: string,
  period: PartialCyclePeriod
): Promise<{ period: CyclePeriod; overview: CycleOverview }> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/periods`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(period),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.period || !data.overview) {
    throw new Error(data.mensagem || 'Não foi possível registrar o período.');
  }
  return {
    period: mapPeriod(data.period),
    overview: mapOverview(data.overview),
  };
}

export async function updatePeriodRequest(
  token: string,
  id: string,
  period: PartialCyclePeriod
): Promise<{ period: CyclePeriod; overview: CycleOverview }> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/periods/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(period),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.period || !data.overview) {
    throw new Error(data.mensagem || 'Não foi possível atualizar o período.');
  }
  return {
    period: mapPeriod(data.period),
    overview: mapOverview(data.overview),
  };
}

export async function deletePeriodRequest(
  token: string,
  id: string
): Promise<CycleOverview> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/periods/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.overview) {
    throw new Error(data.mensagem || 'Não foi possível remover o período.');
  }
  return mapOverview(data.overview);
}

export async function upsertCycleLogRequest(
  token: string,
  log: PartialCycleLog
): Promise<{ log: CycleDailyLog; overview: CycleOverview }> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/logs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(log),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok || !data.log || !data.overview) {
    throw new Error(data.mensagem || 'Não foi possível salvar o registro.');
  }
  return {
    log: mapLog(data.log),
    overview: mapOverview(data.overview),
  };
}

export async function deleteCycleLogRequest(
  token: string,
  id: string
): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/api/cycle/logs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await parseJson<ApiCycleResponse>(response);
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível remover o registro.');
  }
}
