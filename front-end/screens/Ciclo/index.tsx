import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { showErrorAlert } from '@/data/alerts';
import { MONTH_NAMES, startOfDay } from '@/data/dateUtils';
import { useCycle } from '@/hooks/useCycle';
import CicloView from './view';
import { formatIsoDate, getStatusForDate } from './model';

export default function CicloScreen() {
  const router = useRouter();
  const { overview, logs, isLoading, refreshCycle, getLogByDate, saveLog } =
    useCycle();
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }));
  const [isSavingIntimacy, setIsSavingIntimacy] = useState(false);

  const dayStatus = useMemo(
    () => getStatusForDate(overview, selectedDate),
    [overview, selectedDate]
  );

  const monthLabel = useMemo(
    () => `${MONTH_NAMES[visibleMonth.month]} ${visibleMonth.year}`,
    [visibleMonth]
  );

  const markedDates = useMemo(
    () =>
      logs
        .filter((log) => log.intimacy || log.mood || log.flow || log.symptoms.length > 0)
        .map((log) => startOfDay(new Date(`${log.date}T12:00:00`))),
    [logs]
  );

  const selectedIso = useMemo(
    () => formatIsoDate(selectedDate),
    [selectedDate]
  );
  const selectedLog = getLogByDate(selectedIso);
  const hasIntimacy = Boolean(selectedLog?.intimacy);

  const onRefresh = useCallback(() => {
    void refreshCycle();
  }, [refreshCycle]);

  const onSelectDate = useCallback((date: Date) => {
    setSelectedDate(startOfDay(date));
  }, []);

  const onVisibleMonthChange = useCallback((year: number, month: number) => {
    setVisibleMonth({ year, month });
  }, []);

  const onToggleIntimacy = useCallback(async () => {
    setIsSavingIntimacy(true);
    try {
      await saveLog({
        date: selectedIso,
        flow: selectedLog?.flow ?? '',
        mood: selectedLog?.mood ?? '',
        symptoms: selectedLog?.symptoms ?? [],
        intimacy: !hasIntimacy,
        notes: selectedLog?.notes ?? '',
      });
    } catch (error) {
      showErrorAlert(error, 'Não foi possível atualizar a relação.');
    } finally {
      setIsSavingIntimacy(false);
    }
  }, [hasIntimacy, saveLog, selectedIso, selectedLog]);

  const openLog = useCallback(() => {
    router.push({
      pathname: '/ciclo/log',
      params: { date: selectedIso },
    });
  }, [router, selectedIso]);

  return (
    <CicloView
      overview={overview}
      logs={logs}
      dayStatus={dayStatus}
      selectedDate={selectedDate}
      monthLabel={monthLabel}
      markedDates={markedDates}
      hasIntimacy={hasIntimacy}
      isSavingIntimacy={isSavingIntimacy}
      isLoading={isLoading}
      onRefresh={onRefresh}
      onSelectDate={onSelectDate}
      onVisibleMonthChange={onVisibleMonthChange}
      onToggleIntimacy={() => {
        void onToggleIntimacy();
      }}
      onOpenLog={openLog}
      onOpenCalendar={() => router.push('/ciclo/calendario')}
      onOpenAnalysis={() => router.push('/ciclo/analise')}
      onOpenSettings={() => router.push('/ciclo/config')}
      onRegisterPeriod={() => router.push('/ciclo/periodo')}
    />
  );
}
