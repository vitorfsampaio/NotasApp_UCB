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
  <PlanifyBackground>
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
  notesContainer: { flexGrow: 1, padding: 20, paddingBottom: 130 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotasView;
