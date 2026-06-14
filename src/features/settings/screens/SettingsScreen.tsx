import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme';
import { Button, Input } from '@/components/ui';
import { useSettings } from '@/hooks/useSettings';

type DarkModeOption = 'system' | 'light' | 'dark';

const darkModeOptions: { value: DarkModeOption; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsScreen() {
  const { colors, typography, spacing } = useAppTheme();
  const { openaiApiKey, darkModeOverride, saveApiKey, saveDarkMode } =
    useSettings();
  const [apiKeyInput, setApiKeyInput] = useState(openaiApiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    saveApiKey(apiKeyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[typography.heading, { color: colors.textPrimary }]}>
          Settings
        </Text>

        <View style={{ marginTop: spacing.xxl }}>
          <Text
            style={[
              typography.subtitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            Gemini API Key
          </Text>
          <Input
            label="API Key"
            placeholder="AIza…"
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={{ marginTop: spacing.md }}>
            <Button
              title={saved ? 'Saved!' : 'Save API Key'}
              onPress={handleSaveKey}
              variant={saved ? 'secondary' : 'primary'}
            />
          </View>
          <Text
            style={[
              typography.caption,
              { color: colors.textSecondary, marginTop: spacing.sm },
            ]}>
            Your key is stored locally on this device only.
          </Text>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <Text
            style={[
              typography.subtitle,
              { color: colors.textPrimary, marginBottom: spacing.md },
            ]}>
            Appearance
          </Text>
          <View style={styles.segmentRow}>
            {darkModeOptions.map(option => (
              <Pressable
                key={option.value}
                onPress={() => saveDarkMode(option.value)}
                style={[
                  styles.segment,
                  {
                    backgroundColor:
                      darkModeOverride === option.value
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    typography.body,
                    {
                      color:
                        darkModeOverride === option.value
                          ? '#FFFFFF'
                          : colors.textPrimary,
                    },
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.about,
            {
              marginTop: spacing.xxl,
              borderTopColor: colors.border,
              paddingTop: spacing.xl,
            },
          ]}>
          <Text style={[typography.subtitle, { color: colors.textPrimary }]}>
            NeuroNote AI
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}>
            Offline-first AI note-taking app built with React Native New
            Architecture.
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.textSecondary, marginTop: spacing.sm },
            ]}>
            Version 0.0.1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  about: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
