import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FolderKanban, Plus } from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import AppHeader from '@/components/AppHeader';
import IconButton from '@/components/IconButton';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import { colors } from '@/constants/theme';
import type { Project } from '@/types';

interface ProjetosViewProps {
  projects: Project[];
  cardWidth: number;
  onBack: () => void;
  onCreateProject: () => void;
  onProjectPress: (id: string) => void;
}

const ProjetosView: React.FC<ProjetosViewProps> = ({
  projects,
  cardWidth,
  onBack,
  onCreateProject,
  onProjectPress,
}) => (
  <PlanifyBackground>
    <AppHeader
      title='Projetos'
      subtitle={`${projects.length} ${projects.length === 1 ? 'projeto' : 'projetos'}`}
      onBack={onBack}
      enableSecretAccess={false}
      rightAction={
        <IconButton
          variant='square'
          onPress={onCreateProject}
          accessibilityLabel='Novo projeto'
        >
          <Plus size={19} color={colors.text} />
        </IconButton>
      }
    />
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          icon={<FolderKanban size={20} color={colors.textSecondary} />}
          title='Nenhum projeto ainda'
          subtitle='Toque no + para criar seu primeiro projeto.'
        />
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ProjectCard
            project={item}
            width={cardWidth}
            onPress={onProjectPress}
          />
        </View>
      )}
    />
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  column: {
    justifyContent: 'space-between',
  },
  item: {
    marginBottom: 14,
  },
});

export default memo(ProjetosView);
