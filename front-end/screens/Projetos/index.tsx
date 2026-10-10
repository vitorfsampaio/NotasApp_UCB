import React, { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlanner } from '@/hooks/usePlanner';
import ProjetosView from './view';

const HORIZONTAL_PADDING = 40;
const COLUMN_GAP = 14;

const ProjetosScreen: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { projects } = usePlanner();
  const cardWidth = Math.floor((width - HORIZONTAL_PADDING - COLUMN_GAP) / 2);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleCreateProject = useCallback(
    () => router.push('/projeto/novo'),
    [router]
  );
  const handleProjectPress = useCallback(
    (id: string) => router.push(`/projeto/${id}`),
    [router]
  );

  return (
    <ProjetosView
      projects={projects}
      cardWidth={cardWidth}
      onBack={handleBack}
      onCreateProject={handleCreateProject}
      onProjectPress={handleProjectPress}
    />
  );
};

export default ProjetosScreen;
