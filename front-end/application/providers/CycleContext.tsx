import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  CycleDailyLog,
  CycleOverview,
  CycleSettings,
  PartialCycleLog,
  PartialCyclePeriod,
} from '@/domain/models';
import { useAuth } from '@/application/hooks/useAuth';
import {
  createPeriodRequest,
  deleteCycleLogRequest,
  deletePeriodRequest,
  fetchCycleOverview,
  updateCycleSettingsRequest,
  updatePeriodRequest,
  upsertCycleLogRequest,
} from '@/data/api/cycleApi';

const emptyOverview: CycleOverview = {
  settings: {
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lutealPhaseLength: 14,
  },
  periods: [],
  currentCycleDay: null,
  cycleLength: 28,
  periodLength: 5,
  phase: 'unknown',
  daysUntilNextPeriod: null,
  nextPeriodStart: null,
  nextPeriodEnd: null,
  fertileWindowStart: null,
  fertileWindowEnd: null,
  ovulationDate: null,
  currentCycleStart: null,
  isPeriodToday: false,
  isFertileToday: false,
  predictionReady: false,
};

interface CycleContextProps {
  overview: CycleOverview;
  logs: CycleDailyLog[];
  isLoading: boolean;
  refreshCycle: () => Promise<void>;
  getLogByDate: (date: string) => CycleDailyLog | undefined;
  saveLog: (log: PartialCycleLog) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  saveSettings: (settings: CycleSettings) => Promise<void>;
  addPeriod: (period: PartialCyclePeriod) => Promise<void>;
  editPeriod: (id: string, period: PartialCyclePeriod) => Promise<void>;
  removePeriod: (id: string) => Promise<void>;
}

export const CycleContext = createContext<CycleContextProps>({
  overview: emptyOverview,
  logs: [],
  isLoading: false,
  refreshCycle: async () => {},
  getLogByDate: () => undefined,
  saveLog: async () => {},
  removeLog: async () => {},
  saveSettings: async () => {},
  addPeriod: async () => {},
  editPeriod: async () => {},
  removePeriod: async () => {},
});

interface CycleProviderProps {
  children: React.ReactNode;
}

export const CycleProvider: React.FC<CycleProviderProps> = ({ children }) => {
  const { token, isReady } = useAuth();
  const [overview, setOverview] = useState<CycleOverview>(emptyOverview);
  const [logs, setLogs] = useState<CycleDailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCycle = useCallback(async () => {
    if (!token) {
      setOverview(emptyOverview);
      setLogs([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchCycleOverview(token);
      setOverview(data.overview);
      setLogs(data.logs);
    } catch (error) {
      console.error('Erro ao carregar ciclo:', error);
      setOverview(emptyOverview);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!token) {
      setOverview(emptyOverview);
      setLogs([]);
      return;
    }
    void refreshCycle();
  }, [isReady, token, refreshCycle]);

  const getLogByDate = useCallback(
    (date: string) => logs.find((log) => log.date === date),
    [logs]
  );

  const saveLog = useCallback(
    async (log: PartialCycleLog) => {
      if (!token) {
        throw new Error('Faça login para registrar o dia.');
      }
      const result = await upsertCycleLogRequest(token, log);
      setOverview(result.overview);
      setLogs((prev) => [
        result.log,
        ...prev.filter((item) => item.id !== result.log.id && item.date !== result.log.date),
      ]);
    },
    [token]
  );

  const removeLog = useCallback(
    async (id: string) => {
      if (!token) {
        throw new Error('Faça login para remover o registro.');
      }
      await deleteCycleLogRequest(token, id);
      setLogs((prev) => prev.filter((item) => item.id !== id));
    },
    [token]
  );

  const saveSettings = useCallback(
    async (settings: CycleSettings) => {
      if (!token) {
        throw new Error('Faça login para salvar configurações.');
      }
      const result = await updateCycleSettingsRequest(token, settings);
      setOverview(result.overview);
    },
    [token]
  );

  const addPeriod = useCallback(
    async (period: PartialCyclePeriod) => {
      if (!token) {
        throw new Error('Faça login para registrar o período.');
      }
      const result = await createPeriodRequest(token, period);
      setOverview(result.overview);
    },
    [token]
  );

  const editPeriod = useCallback(
    async (id: string, period: PartialCyclePeriod) => {
      if (!token) {
        throw new Error('Faça login para editar o período.');
      }
      const result = await updatePeriodRequest(token, id, period);
      setOverview(result.overview);
    },
    [token]
  );

  const removePeriod = useCallback(
    async (id: string) => {
      if (!token) {
        throw new Error('Faça login para remover o período.');
      }
      const nextOverview = await deletePeriodRequest(token, id);
      setOverview(nextOverview);
    },
    [token]
  );

  const value = useMemo(
    () => ({
      overview,
      logs,
      isLoading,
      refreshCycle,
      getLogByDate,
      saveLog,
      removeLog,
      saveSettings,
      addPeriod,
      editPeriod,
      removePeriod,
    }),
    [
      overview,
      logs,
      isLoading,
      refreshCycle,
      getLogByDate,
      saveLog,
      removeLog,
      saveSettings,
      addPeriod,
      editPeriod,
      removePeriod,
    ]
  );

  return (
    <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
  );
};
