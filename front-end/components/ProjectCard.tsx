import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProgressBar from '@/components/ProgressBar';
import type { Project } from '@/types';
import { colors, fonts, shadows } from '@/constants/theme';

interface ProjectCardProps {
  project: Project;
  onPress: (id: string) => void;
  width?: number;
}

const coverThemes = [
  { background: '#2A2F2C', title: '#E9ECE6', pillDot: colors.pillBlue },
  { background: '#EFE8DD', title: '#3B3A35', pillDot: colors.sageDot },
  { background: '#E4E6E1', title: '#2C322E', pillDot: colors.sageDot },
];

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  width = 140,
}) => {
  const handlePress = useCallback(
    () => onPress(project.id),
    [onPress, project.id],
  );
  const theme = useMemo(() => {
    const hash = [...project.id].reduce(
      (total, char) => total + char.charCodeAt(0),
      0,
    );
    return coverThemes[hash % coverThemes.length];
  }, [project.id]);
  const isDone = project.progress >= 100;

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={[styles.cover, { backgroundColor: theme.background }]}>
        <View style={styles.pill}>
          <View
            style={[
              styles.pillDot,
              { backgroundColor: isDone ? colors.sageDot : theme.pillDot },
            ]}
          />
          <Text style={styles.pillText}>
            {isDone ? 'Concluído' : 'Em andamento'}
          </Text>
        </View>
        <Text
          style={[styles.coverTitle, { color: theme.title }]}
          numberOfLines={1}
        >
          {project.name}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {project.subtitle || 'Sem descrição'}
        </Text>
        <Text style={styles.percent}>{project.progress}%</Text>
        <ProgressBar progress={project.progress} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.soft,
  },
  cover: {
    height: 84,
    padding: 8,
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  pillText: {
    fontSize: 9,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  coverTitle: {
    fontSize: 22,
    fontFamily: fonts.handwrittenBold,
    textAlign: 'center',
    marginBottom: 6,
  },
  body: {
    padding: 12,
  },
  name: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  percent: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});

export default memo(ProjectCard);
