import React, { memo } from 'react';
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  ChevronRight,
  FolderKanban,
  ListTodo,
} from 'lucide-react-native';
import PlanifyBackground from '@/components/PlanifyBackground';
import HandwrittenNote from '@/components/HandwrittenNote';
import IconButton from '@/components/IconButton';
import Avatar from '@/components/Avatar';
import ProgressBar from '@/components/ProgressBar';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/ProjectCard';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import { colors, fonts } from '@/constants/theme';
import type { Project, Task, WeekSummary } from './model';

interface InicioViewProps {
  greeting: string;
  firstName: string;
  fullName: string;
  hasPendingReminder: boolean;
  weekSummary: WeekSummary;
  projects: Project[];
  todayTasks: Task[];
  isLoading: boolean;
  onRefresh: () => void;
  onNamePress: () => void;
  onNameLongPress: () => void;
  onBellPress: () => void;
  onAvatarPress: () => void;
  onWeekCardPress: () => void;
  onSeeAllProjects: () => void;
  onProjectPress: (id: string) => void;
  onTaskPress: (id: string) => void;
  onTaskToggle: (id: string) => void;
}

const InicioView: React.FC<InicioViewProps> = ({
  greeting,
  firstName,
  fullName,
  hasPendingReminder,
  weekSummary,
  projects,
  todayTasks,
  isLoading,
  onRefresh,
  onNamePress,
  onNameLongPress,
  onBellPress,
  onAvatarPress,
  onWeekCardPress,
  onSeeAllProjects,
  onProjectPress,
  onTaskPress,
  onTaskToggle,
}) => {
  const weekProgress =
    weekSummary.total > 0
      ? (weekSummary.completed / weekSummary.total) * 100
      : 0;

  return (
    <PlanifyBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              tintColor={colors.buttonSolid}
            />
          }
        >
          <View style={styles.topBar}>
            <HandwrittenNote
              lines={['Pequenos passos', 'Grandes resultados']}
              accent='arrow'
            />
            <View style={styles.topActions}>
              <IconButton
                variant='plain'
                onPress={onBellPress}
                accessibilityLabel='Lembretes'
              >
                <Bell size={22} color={colors.text} strokeWidth={1.8} />
                {hasPendingReminder ? <View style={styles.bellDot} /> : null}
              </IconButton>
              <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.85}>
                <Avatar name={fullName} size={38} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.greeting}>{greeting}</Text>
          <TouchableOpacity
            testID='e2e_sos_header'
            onPress={onNamePress}
            onLongPress={onNameLongPress}
            delayLongPress={650}
            activeOpacity={1}
          >
            <Text style={styles.name} numberOfLines={1}>
              {firstName} 👋
            </Text>
          </TouchableOpacity>
          <Text style={styles.tagline}>
            Construa o que você ama. Um passo de cada vez.
          </Text>

          <TouchableOpacity activeOpacity={0.9} onPress={onWeekCardPress}>
            <ImageBackground
              source={require('../../assets/images/week-mountains.jpg')}
              style={styles.weekCard}
              imageStyle={styles.weekImage}
            >
              <View style={styles.weekOverlay} />
              <Text style={styles.weekLabel}>Esta semana</Text>
              <View style={styles.weekCountRow}>
                <Text style={styles.weekCount}>{weekSummary.completed}</Text>
                <Text style={styles.weekTotal}> / {weekSummary.total}</Text>
              </View>
              <Text style={styles.weekLabel}>tarefas</Text>
              <View style={styles.weekBar}>
                <ProgressBar
                  progress={weekProgress}
                  trackColor='rgba(255,255,255,0.25)'
                  fillColor={colors.white}
                  height={3}
                />
              </View>
              <View style={styles.keepGoing}>
                <Text style={styles.keepGoingText}>Continue assim</Text>
                <ChevronRight size={14} color={colors.white} />
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <View style={styles.section}>
            <SectionHeader
              title='Projetos atuais'
              actionLabel='Ver todos'
              showActionArrow
              onActionPress={onSeeAllProjects}
            />
            {projects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban size={20} color={colors.textSecondary} />}
                title='Nenhum projeto ainda'
                subtitle='Toque no + para criar seu primeiro projeto.'
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.projectsRow}
                style={styles.projectsScroll}
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={onProjectPress}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <SectionHeader
              title='Tarefas de hoje'
              actionLabel={`${todayTasks.length} ${todayTasks.length === 1 ? 'tarefa' : 'tarefas'}`}
            />
            {todayTasks.length === 0 ? (
              <EmptyState
                icon={<ListTodo size={20} color={colors.textSecondary} />}
                title='Dia livre por aqui'
                subtitle='Nenhuma tarefa para hoje. Toque no + para adicionar.'
              />
            ) : (
              todayTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  onPress={onTaskPress}
                  showDivider={index < todayTasks.length - 1}
                />
              ))
            )}
          </View>

          <HandwrittenNote
            lines={['Melhor que', 'ontem']}
            accent='underline'
            rotation={-10}
            style={styles.bottomNote}
          />
        </ScrollView>
      </SafeAreaView>
    </PlanifyBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.notification,
    borderWidth: 1,
    borderColor: colors.background,
  },
  greeting: {
    fontSize: 22,
    fontFamily: fonts.regular,
    color: colors.text,
    letterSpacing: -0.3,
  },
  name: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.8,
    marginTop: 2,
  },
  tagline: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  weekCard: {
    marginTop: 20,
    height: 118,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
  weekImage: {
    borderRadius: 18,
  },
  weekOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    backgroundColor: 'rgba(20, 24, 21, 0.28)',
  },
  weekLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  weekCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 2,
  },
  weekCount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  weekTotal: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  weekBar: {
    marginTop: 10,
    width: '62%',
  },
  keepGoing: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 18,
    bottom: 34,
  },
  keepGoingText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
    marginRight: 2,
  },
  section: {
    marginTop: 26,
  },
  projectsScroll: {
    marginHorizontal: -22,
  },
  projectsRow: {
    paddingHorizontal: 22,
    paddingBottom: 8,
    gap: 12,
  },
  bottomNote: {
    marginTop: 20,
  },
});

export default memo(InicioView);
