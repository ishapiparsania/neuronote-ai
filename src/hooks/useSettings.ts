import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  setDarkModeOverride,
  setOpenaiApiKey,
} from '@/store/settingsSlice';

export function useSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const openaiApiKey = useSelector(
    (state: RootState) => state.settings.openaiApiKey,
  );
  const darkModeOverride = useSelector(
    (state: RootState) => state.settings.darkModeOverride,
  );
  const hydrated = useSelector(
    (state: RootState) => state.settings.hydrated,
  );

  const saveApiKey = useCallback(
    (key: string) => {
      dispatch(setOpenaiApiKey(key.trim()));
    },
    [dispatch],
  );

  const saveDarkMode = useCallback(
    (mode: 'system' | 'light' | 'dark') => {
      dispatch(setDarkModeOverride(mode));
    },
    [dispatch],
  );

  return {
    openaiApiKey,
    darkModeOverride,
    hydrated,
    saveApiKey,
    saveDarkMode,
  };
}
