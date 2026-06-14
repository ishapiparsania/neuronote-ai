import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addNote, deleteNote, updateNote } from '@/store/notesSlice';
import { Note } from '@/types/note';

export function useNotes() {
  const dispatch = useDispatch<AppDispatch>();
  const notes = useSelector((state: RootState) => state.notes.notes);
  const hydrated = useSelector((state: RootState) => state.notes.hydrated);

  const createNote = useCallback(
    (title: string, content: string) => {
      dispatch(addNote({ title, content }));
    },
    [dispatch],
  );

  const editNote = useCallback(
    (id: string, title: string, content: string) => {
      dispatch(updateNote({ id, title, content }));
    },
    [dispatch],
  );

  const removeNote = useCallback(
    (id: string) => {
      dispatch(deleteNote(id));
    },
    [dispatch],
  );

  const getNoteById = useCallback(
    (id: string): Note | undefined => notes.find(n => n.id === id),
    [notes],
  );

  const filterNotes = useCallback(
    (query: string): Note[] => {
      const q = query.trim().toLowerCase();
      if (!q) return notes;
      return notes.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      );
    },
    [notes],
  );

  return useMemo(
    () => ({
      notes,
      hydrated,
      createNote,
      editNote,
      removeNote,
      getNoteById,
      filterNotes,
    }),
    [
      notes,
      hydrated,
      createNote,
      editNote,
      removeNote,
      getNoteById,
      filterNotes,
    ],
  );
}
