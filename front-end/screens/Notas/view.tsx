import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import EmptyNotes from '@/components/EmptyNotes';
import { Plus } from 'lucide-react-native';
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
    <AppHeader title="Notas!" />
    {isLoading && notes.length === 0 ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.buttonSolid} />
      </View>
    ) : (
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesContainer}
        ListEmptyComponent={EmptyNotes}
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
    <TouchableOpacity
      style={styles.addButton}
      onPress={onCreateNote}
      activeOpacity={0.85}
    >
      <View style={styles.addButtonInner}>
        <Plus color={colors.white} size={28} />
      </View>
    </TouchableOpacity>
  </PlanifyBackground>
);

const styles = StyleSheet.create({
  notesContainer: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 28,
    bottom: 36,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonSolid,
    borderWidth: 1.5,
    borderColor: colors.buttonBorder,
  },
});

export default NotasView;
