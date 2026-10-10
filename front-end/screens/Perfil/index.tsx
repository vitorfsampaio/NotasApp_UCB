import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePlanner } from '@/hooks/usePlanner';
import { mainFocusLabels, usageTypeLabels } from '@/constants/userPreferences';
import PerfilView from './view';
import type { ProfileStat } from './model';

const PerfilScreen: React.FC = () => {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const { tasks, events, projects } = usePlanner();

  const stats = useMemo<ProfileStat[]>(
    () => [
      {
        label: 'Tarefas feitas',
        value: tasks.filter((task) => task.completed).length,
      },
      { label: 'Eventos', value: events.length },
      { label: 'Projetos', value: projects.length },
    ],
    [tasks, events, projects],
  );

  const preferences = useMemo(() => {
    const items: string[] = [];
    if (usuario?.usageType) {
      items.push(usageTypeLabels[usuario.usageType]);
    }
    if (usuario?.mainFocus) {
      items.push(`Foco: ${mainFocusLabels[usuario.mainFocus]}`);
    }
    return items;
  }, [usuario?.usageType, usuario?.mainFocus]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/onboarding');
  }, [logout, router]);

  return (
    <PerfilView
      fullName={usuario?.fullName || usuario?.username || ''}
      username={usuario?.username ?? ''}
      preferences={preferences}
      stats={stats}
      onLogout={handleLogout}
    />
  );
};

export default PerfilScreen;
