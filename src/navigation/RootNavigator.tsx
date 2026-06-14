import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/theme';
import { RootTabParamList } from '@/types/navigation';
import { NotesStack } from './NotesStack';
import { AIStack } from './AIStack';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Notes: '📝',
    AI: '✨',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[label] ?? '•'}
    </Text>
  );
}

function renderTabIcon(label: string) {
  return ({ focused }: { focused: boolean }) => (
    <TabIcon label={label} focused={focused} />
  );
}

export function RootNavigator() {
  const { colors, typography } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: typography.caption,
      }}>
      <Tab.Screen
        name="NotesTab"
        component={NotesStack}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: renderTabIcon('Notes'),
        }}
      />
      <Tab.Screen
        name="AITab"
        component={AIStack}
        options={{
          tabBarLabel: 'AI',
          tabBarIcon: renderTabIcon('AI'),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('AITab', { screen: 'AISummary' });
          },
        })}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: renderTabIcon('Settings'),
        }}
      />
    </Tab.Navigator>
  );
}
