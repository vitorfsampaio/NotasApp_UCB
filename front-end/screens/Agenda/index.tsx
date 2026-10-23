import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { usePlanner } from '@/hooks/usePlanner';
import { MONTH_NAMES, isSameDay, startOfDay } from '@/utils/dateUtils';
import AgendaView from './view';

const AgendaScreen: React.FC = () => {
  const router = useRouter();
  const { events, isLoading, refreshPlanner } = usePlanner();
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfDay(new Date())
  );
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [now, setNow] = useState(() => new Date());
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNow(new Date());
    }, [])
  );

  const dayEvents = useMemo(
    () => events.filter((event) => isSameDay(event.startsAt, selectedDate)),
    [events, selectedDate]
  );

  const markedDates = useMemo(
    () => events.map((event) => event.startsAt),
    [events]
  );

  const ongoingEventId = useMemo(() => {
    const ongoing = dayEvents.find((event) => {
      const end = event.startsAt.getTime() + event.durationMinutes * 60000;
      return event.startsAt <= now && end > now.getTime();
    });
    return ongoing?.id ?? null;
  }, [dayEvents, now]);

  const highlightedEventId = useMemo(() => {
    if (startOfDay(selectedDate) < startOfDay(now)) {
      return null;
    }
    const upcoming = dayEvents.find(
      (event) => event.id !== ongoingEventId && event.startsAt > now
    );
    return upcoming?.id ?? null;
  }, [dayEvents, now, selectedDate, ongoingEventId]);

  const monthLabel = `${MONTH_NAMES[visibleMonth.month]} ${visibleMonth.year}`;

  const handleRefresh = useCallback(() => {
    void refreshPlanner();
  }, [refreshPlanner]);

  const handleBack = useCallback(() => router.navigate('/'), [router]);

  const handleGoToToday = useCallback(() => {
    const today = startOfDay(new Date());
    setSelectedDate(today);
    setVisibleMonth({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
  }, []);

  const openMonthPicker = useCallback(() => setIsMonthPickerVisible(true), []);
  const closeMonthPicker = useCallback(
    () => setIsMonthPickerVisible(false),
    []
  );

  const handleSelectMonth = useCallback((year: number, month: number) => {
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;
    const next = startOfDay(isCurrentMonth ? today : new Date(year, month, 1));
    setSelectedDate(next);
    setVisibleMonth({ year, month });
    setIsMonthPickerVisible(false);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    const next = startOfDay(date);
    setSelectedDate(next);
    setVisibleMonth({
      year: next.getFullYear(),
      month: next.getMonth(),
    });
  }, []);

  const handleVisibleMonthChange = useCallback(
    (year: number, month: number) => {
      setVisibleMonth((prev) => {
        if (prev.year === year && prev.month === month) {
          return prev;
        }
        return { year, month };
      });
    },
    []
  );

  const handleEventPress = useCallback(
    (id: string) => router.push(`/evento/${id}`),
    [router]
  );

  const handleCreateEvent = useCallback(() => {
    router.push({
      pathname: '/evento/[id]',
      params: { id: 'novo', data: selectedDate.toISOString() },
    });
  }, [router, selectedDate]);

  return (
    <AgendaView
      monthLabel={monthLabel}
      selectedDate={selectedDate}
      markedDates={markedDates}
      dayEvents={dayEvents}
      highlightedEventId={highlightedEventId}
      ongoingEventId={ongoingEventId}
      isLoading={isLoading}
      isMonthPickerVisible={isMonthPickerVisible}
      onRefresh={handleRefresh}
      onBack={handleBack}
      onGoToToday={handleGoToToday}
      onOpenMonthPicker={openMonthPicker}
      onCloseMonthPicker={closeMonthPicker}
      onSelectMonth={handleSelectMonth}
      onSelectDate={handleSelectDate}
      onVisibleMonthChange={handleVisibleMonthChange}
      onEventPress={handleEventPress}
      onCreateEvent={handleCreateEvent}
    />
  );
};

export default AgendaScreen;
