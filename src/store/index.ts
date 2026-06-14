import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
