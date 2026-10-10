import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePlanner } from '@/hooks/usePlanner';
import { useSecurity } from '@/hooks/useSecurity';
import { showErrorAlert } from '@/utils/alerts';
import {
  addDays,
  getGreeting,
  isSameDay,
  startOfWeek,
} from '@/utils/dateUtils';
import InicioView from './view';
import type { WeekSummary } from './model';

const InicioScreen: React.FC = () => {
  const router = useRouter();
  const { usuario } = useAuth();
  const { tasks, events, projects, isLoading, refreshPlanner, toggleTask } =
    usePlanner();
  const { authenticateForSecurityAccess, onHeaderSecretTap } = useSecurity();

  const [now, setNow] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      setNow(new Date());
    }, [])
  );
  const fullName = usuario?.fullName || usuario?.username || '';
  const firstName = fullName.trim().split(/\s+/)[0] || 'você';

  const todayTasks = useMemo(
    () => tasks.filter((task) => isSameDay(task.dueAt, now)),
    [tasks, now]
  );

  const weekSummary = useMemo<WeekSummary>(() => {
    const weekStart = startOfWeek(now);
    const weekEnd = addDays(weekStart, 7);
    const weekTasks = tasks.filter(
      (task) => task.dueAt >= weekStart && task.dueAt < weekEnd
    );
    return {
      completed: weekTasks.filter((task) => task.completed).length,
      total: weekTasks.length,
    };
  }, [tasks, now]);

  const hasPendingReminder = useMemo(
    () =>
      events.some(
        (event) =>
          isSameDay(event.startsAt, now) &&
          event.startsAt > now &&
          event.reminderMinutes !== null
      ),
    [events, now]
  );

  const handleRefresh = useCallback(() => {
    void refreshPlanner();
  }, [refreshPlanner]);

  const handleNamePress = useCallback(() => {
    void onHeaderSecretTap();
  }, [onHeaderSecretTap]);

  const handleNameLongPress = useCallback(() => {
    authenticateForSecurityAccess().then((success) => {
      if (success) {
        router.push('/seguranca');
      }
    });
  }, [authenticateForSecurityAccess, router]);

  const goToAgenda = useCallback(() => router.navigate('/agenda'), [router]);
  const goToProfile = useCallback(() => router.navigate('/perfil'), [router]);
  const goToProjects = useCallback(() => router.push('/projetos'), [router]);

  const handleProjectPress = useCallback(
    (id: string) => router.push(`/projeto/${id}`),
    [router]
  );

  const handleTaskPress = useCallback(
    (id: string) => router.push(`/tarefa/${id}`),
    [router]
  );

  const handleTaskToggle = useCallback(
    (id: string) => {
      toggleTask(id).catch((error: unknown) =>
        showErrorAlert(error, 'Erro ao atualizar a tarefa.')
      );
    },
    [toggleTask]
  );

  return (
    <InicioView
      greeting={getGreeting(now)}
      firstName={firstName}
      fullName={fullName}
      hasPendingReminder={hasPendingReminder}
      weekSummary={weekSummary}
      projects={projects}
      todayTasks={todayTasks}
      isLoading={isLoading}
      onRefresh={handleRefresh}
      onNamePress={handleNamePress}
      onNameLongPress={handleNameLongPress}
      onBellPress={goToAgenda}
      onAvatarPress={goToProfile}
      onWeekCardPress={goToAgenda}
      onSeeAllProjects={goToProjects}
      onProjectPress={handleProjectPress}
      onTaskPress={handleTaskPress}
      onTaskToggle={handleTaskToggle}
    />
  );
};

export default InicioScreen;
