import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { useSecurity } from '@/hooks/useSecurity';
import { Platform, Alert } from 'react-native';
import { fetchNoteById } from '@/utils/notesApi';
import NotaDetalheView from './view';

const NotaDetalheScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const { getNoteById, updateNote, deleteNote, createNote } = useNotes();
  const { checkForKeyword } = useSecurity();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNewNote, setIsNewNote] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (id === 'nova') {
        setIsNewNote(true);
        setTitle('');
        setContent('');
        return;
      }

      setIsNewNote(false);
      const cached = getNoteById(id as string);
      if (cached) {
        setTitle(cached.title);
        setContent(cached.content);
        return;
      }

      if (!token) {
        return;
      }

      try {
        const note = await fetchNoteById(token, id as string);
        if (!cancelled) {
          setTitle(note.title);
          setContent(note.content);
        }
      } catch {
        if (!cancelled) {
          setTitle('');
          setContent('');
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, getNoteById, token]);

  const saveNote = useCallback(async () => {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    try {
      if (isNewNote) {
        if (title.trim() || content.trim()) {
          await createNote({
            title: title.trim() || 'Nota sem título',
            content: content.trim(),
          });
        }
      } else if (id) {
        await updateNote(id as string, {
          title: title.trim() || 'Nota sem título',
          content: content.trim(),
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao salvar a nota.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      savingRef.current = false;
    }
  }, [isNewNote, id, title, content, createNote, updateNote]);

  const handleBackPress = useCallback(async () => {
    await saveNote();
    router.back();
  }, [router, saveNote]);

  const handleContentChange = useCallback(
    (text: string) => {
      setContent(text);
      checkForKeyword(text);
    },
    [checkForKeyword]
  );

  const handleDeleteNote = useCallback(() => {
    const runDelete = async () => {
      try {
        await deleteNote(id as string);
        router.back();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erro ao excluir a nota.';
        if (Platform.OS === 'web') {
          window.alert(message);
        } else {
          Alert.alert('Erro', message);
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente excluir esta nota?')) {
        void runDelete();
      }
    } else {
      Alert.alert('Excluir Nota', 'Deseja realmente excluir esta nota?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void runDelete();
          },
        },
      ]);
    }
  }, [id, deleteNote, router]);

  const handleAddNote = useCallback(async () => {
    if (!isNewNote || (!title.trim() && !content.trim())) {
      return;
    }
    try {
      await createNote({
        title: title.trim() || 'Nota sem título',
        content: content.trim(),
      });
      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar a nota.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    }
  }, [isNewNote, title, content, createNote, router]);

  return (
    <NotaDetalheView
      title={title}
      content={content}
      isNewNote={isNewNote}
      onTitleChange={setTitle}
      onContentChange={handleContentChange}
      onBack={handleBackPress}
      onDelete={!isNewNote ? handleDeleteNote : undefined}
      onAddNote={isNewNote ? handleAddNote : undefined}
    />
  );
};

export default NotaDetalheScreen;
