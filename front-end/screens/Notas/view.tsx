import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import EmptyState from '@/components/EmptyState';
import HandwrittenNote from '@/components/HandwrittenNote';
import IconButton from '@/components/IconButton';
import { FilePlus, Plus } from 'lucide-react-native';
import { Note } from './model';
import PlanifyBackground from '@/components/PlanifyBackground';
import { colors } from '@/constants/theme';

interface NotasViewProps {
  notes: Note[];
  isLoading: boolean;
  onRefresh: () => void;
  onCreateNote: () => void;
  renderItem: ({ item }: { item: Note }) => JSX.Element;
}

const NotasView: React.FC<NotasViewProps> = ({
  notes,
  isLoading,
  onRefresh,
  onCreateNote,
  renderItem,
}) => (
  <PlanifyBackground showLeaves>
    <AppHeader
      title='Notas'
      subtitle='Suas ideias em um só lugar.'
      rightAction={
        <IconButton
          variant='square'
          onPress={onCreateNote}
          accessibilityLabel='Nova nota'
        >
          <Plus size={19} color={colors.text} />
        </IconButton>
      }
    />
    <View style={styles.noteRow}>
      <HandwrittenNote
        lines={['Ideias que', 'florescem']}
        accent='arrow'
        rotation={-8}
      />
    </View>
    {isLoading && notes.length === 0 ? (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color={colors.buttonSolid} />
      </View>
    ) : (
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesContainer}
        ListEmptyComponent={
          <EmptyState
            icon={<FilePlus size={20} color={colors.textSecondary} />}
            title='Sem notas'
            subtitle='Toque no + para criar uma nova nota.'
          />
        }
        ListFooterComponent={
          notes.length > 0 ? (
            <HandwrittenNote
              lines={['Melhor que', 'ontem']}
              accent='underline'
              rotation={-10}
              style={styles.bottomNote}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.buttonSolid}
          />
        }
      />
    )}
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  noteRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  notesContainer: { flexGrow: 1, padding: 20, paddingBottom: 130 },
  bottomNote: {
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotasView;
