import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Note, PartialNote } from '@/domain/models';
import { useAuth } from '@/application/hooks/useAuth';
import {
  createNoteRequest,
  deleteNoteRequest,
  fetchNotes,
  updateNoteRequest,
} from '@/data/api/notesApi';

interface NotesContextProps {
  notes: Note[];
  isLoading: boolean;
  refreshNotes: () => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  createNote: (noteData: PartialNote) => Promise<Note>;
  updateNote: (id: string, noteData: Partial<PartialNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const NotesContext = createContext<NotesContextProps>({
  notes: [],
  isLoading: false,
  refreshNotes: async () => {},
  getNoteById: () => undefined,
  createNote: async () => ({
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateNote: async () => {},
  deleteNote: async () => {},
});

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const { token, isReady } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }
    setIsLoading(true);
    try {
      const list = await fetchNotes(token);
      setNotes(list);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!token) {
      setNotes([]);
      return;
    }
    void refreshNotes();
  }, [isReady, token, refreshNotes]);

  const getNoteById = useCallback(
    (id: string) => notes.find((note) => note.id === id),
    [notes]
  );

  const createNote = useCallback(
    async (noteData: PartialNote): Promise<Note> => {
      if (!token) {
        throw new Error('Faça login para criar notas.');
      }
      const created = await createNoteRequest(token, noteData);
      setNotes((prev) => [created, ...prev.filter((n) => n.id !== created.id)]);
      return created;
    },
    [token]
  );

  const updateNote = useCallback(
    async (id: string, noteData: Partial<PartialNote>) => {
      if (!token) {
        throw new Error('Faça login para editar notas.');
      }
      const updated = await updateNoteRequest(token, id, noteData);
      setNotes((prev) =>
        prev
          .map((note) => (note.id === id ? updated : note))
          .sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
          )
      );
    },
    [token]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!token) {
        throw new Error('Faça login para excluir notas.');
      }
      await deleteNoteRequest(token, id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [token]
  );

  const value = useMemo(
    () => ({
      notes,
      isLoading,
      refreshNotes,
      getNoteById,
      createNote,
      updateNote,
      deleteNote,
    }),
    [
      notes,
      isLoading,
      refreshNotes,
      getNoteById,
      createNote,
      updateNote,
      deleteNote,
    ]
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};
