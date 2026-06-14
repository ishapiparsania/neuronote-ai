import notesReducer, {
  addNote,
  deleteNote,
  updateNote,
  hydrateNotes,
} from '@/store/notesSlice';

jest.mock('@/storage/mmkv', () => ({
  saveNotes: jest.fn(),
}));

describe('notesSlice', () => {
  const initialState = { notes: [], hydrated: false };

  it('hydrates notes', () => {
    const notes = [
      {
        id: '1',
        title: 'Test',
        content: 'Body',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];
    const state = notesReducer(initialState, hydrateNotes(notes));
    expect(state.notes).toEqual(notes);
    expect(state.hydrated).toBe(true);
  });

  it('adds a note at the beginning', () => {
    const state = notesReducer(
      initialState,
      addNote({ title: 'New', content: 'Content' }),
    );
    expect(state.notes).toHaveLength(1);
    expect(state.notes[0].title).toBe('New');
    expect(state.notes[0].content).toBe('Content');
    expect(state.notes[0].id).toBeDefined();
  });

  it('updates an existing note', () => {
    const hydrated = notesReducer(
      initialState,
      hydrateNotes([
        {
          id: 'abc',
          title: 'Old',
          content: 'Old body',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]),
    );
    const state = notesReducer(
      hydrated,
      updateNote({ id: 'abc', title: 'Updated', content: 'New body' }),
    );
    expect(state.notes[0].title).toBe('Updated');
    expect(state.notes[0].content).toBe('New body');
  });

  it('deletes a note by id', () => {
    const hydrated = notesReducer(
      initialState,
      hydrateNotes([
        {
          id: 'abc',
          title: 'Note',
          content: '',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]),
    );
    const state = notesReducer(hydrated, deleteNote('abc'));
    expect(state.notes).toHaveLength(0);
  });
});
