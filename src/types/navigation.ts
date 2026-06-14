import { NavigatorScreenParams } from '@react-navigation/native';

export type NotesStackParamList = {
  NotesList: undefined;
  NoteEditor: { noteId?: string };
};

export type AIStackParamList = {
  AISummary: undefined;
  ChatWithNotes: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type RootTabParamList = {
  NotesTab: NavigatorScreenParams<NotesStackParamList>;
  AITab: NavigatorScreenParams<AIStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
