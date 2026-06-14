import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '@/types/note';
import { generateId } from '@/utils/uuid';
import { saveNotes } from '@/storage/mmkv';

type NotesState = {
  notes: Note[];
  hydrated: boolean;
};

const initialState: NotesState = {
  notes: [],
  hydrated: false,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    hydrateNotes(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
      state.hydrated = true;
    },
    addNote(state, action: PayloadAction<{ title: string; content: string }>) {
      const now = new Date().toISOString();
      const note: Note = {
        id: generateId(),
        title: action.payload.title,
        content: action.payload.content,
        createdAt: now,
        updatedAt: now,
      };
      state.notes.unshift(note);
      saveNotes(state.notes);
    },
    updateNote(
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>,
    ) {
      const index = state.notes.findIndex(n => n.id === action.payload.id);
      if (index === -1) return;
      state.notes[index] = {
        ...state.notes[index],
        title: action.payload.title,
        content: action.payload.content,
        updatedAt: new Date().toISOString(),
      };
      saveNotes(state.notes);
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter(n => n.id !== action.payload);
      saveNotes(state.notes);
    },
  },
});

export const { hydrateNotes, addNote, updateNote, deleteNote } =
  notesSlice.actions;
export default notesSlice.reducer;
