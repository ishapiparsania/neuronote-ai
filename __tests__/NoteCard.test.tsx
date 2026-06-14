import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NoteCard } from '@/features/notes/components/NoteCard';
import { ThemeProvider } from '@/theme/ThemeProvider';
import notesReducer from '@/store/notesSlice';
import settingsReducer from '@/store/settingsSlice';

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
  })),
}));

const note = {
  id: '1',
  title: 'Test Note',
  content: 'This is a preview of the note content for testing.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const store = configureStore({
  reducer: { notes: notesReducer, settings: settingsReducer },
});

function wrap(ui: React.ReactElement) {
  return (
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>
  );
}

describe('NoteCard', () => {
  it('renders title and preview', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        wrap(<NoteCard note={note} onPress={jest.fn()} />),
      );
    });
    const json = tree!.toJSON();
    expect(JSON.stringify(json)).toContain('Test Note');
  });
});
