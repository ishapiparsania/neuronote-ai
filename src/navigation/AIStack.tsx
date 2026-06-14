import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AISummaryScreen } from '@/features/ai/screens/AISummaryScreen';
import { ChatScreen } from '@/features/ai/screens/ChatScreen';
import { AIStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AIStackParamList>();

export function AIStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AISummary" component={AISummaryScreen} />
      <Stack.Screen name="ChatWithNotes" component={ChatScreen} />
    </Stack.Navigator>
  );
}
