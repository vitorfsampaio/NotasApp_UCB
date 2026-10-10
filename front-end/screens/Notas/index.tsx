import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import NoteItem from '@/components/NoteItem';
import NotasView from './view';
import type { Note } from './model';

const NotasScreen: React.FC = () => {
  const { notes, isLoading, refreshNotes } = useNotes();
  const router = useRouter();

  const handleCreateNote = useCallback(() => {
    router.push('/nota/nova');
  }, [router]);

  const renderItem = useCallback(({ item }: { item: Note }) => {
    return <NoteItem note={item} />;
  }, []);

  const handleRefresh = useCallback(() => {
    void refreshNotes();
  }, [refreshNotes]);

  return (
    <NotasView
      notes={notes}
      isLoading={isLoading}
      onRefresh={handleRefresh}
      onCreateNote={handleCreateNote}
      renderItem={renderItem}
    />
  );
};

export default NotasScreen;
