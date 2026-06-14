import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveSettings, StoredSettings } from '@/storage/mmkv';

type SettingsState = StoredSettings & {
  hydrated: boolean;
};

const initialState: SettingsState = {
  openaiApiKey: '',
  darkModeOverride: 'system',
  hydrated: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    hydrateSettings(state, action: PayloadAction<StoredSettings>) {
      state.openaiApiKey = action.payload.openaiApiKey;
      state.darkModeOverride = action.payload.darkModeOverride;
      state.hydrated = true;
    },
    setOpenaiApiKey(state, action: PayloadAction<string>) {
      state.openaiApiKey = action.payload;
      saveSettings({
        openaiApiKey: state.openaiApiKey,
        darkModeOverride: state.darkModeOverride,
      });
    },
    setDarkModeOverride(
      state,
      action: PayloadAction<'system' | 'light' | 'dark'>,
    ) {
      state.darkModeOverride = action.payload;
      saveSettings({
        openaiApiKey: state.openaiApiKey,
        darkModeOverride: state.darkModeOverride,
      });
    },
  },
});

export const { hydrateSettings, setOpenaiApiKey, setDarkModeOverride } =
  settingsSlice.actions;
export default settingsSlice.reducer;
