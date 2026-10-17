import { useContext } from 'react';
import { NotesContext } from '@/application/providers/NotesContext';

export function useNotes() {
  return useContext(NotesContext);
}