import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesListScreen } from '@/features/notes/screens/NotesListScreen';
import { NoteEditorScreen } from '@/features/notes/screens/NoteEditorScreen';
import { NotesStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<NotesStackParamList>();

export function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
    </Stack.Navigator>
  );
}
