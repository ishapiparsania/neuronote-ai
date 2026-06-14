import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AIStackParamList } from '@/types/navigation';
import { useAppTheme } from '@/theme';
import {
  Button,
  Card,
  EmptyState,
  LoadingOverlay,
} from '@/components/ui';
import { useNotes } from '@/hooks/useNotes';
import { useAI } from '@/hooks/useAI';

type Nav = NativeStackNavigationProp<AIStackParamList, 'AISummary'>;

export function AISummaryScreen() {
  const { colors, typography, spacing } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const { notes } = useNotes();
  const { summarize, isLoading, error, summaryResult, hasApiKey, resetSummary } =
    useAI();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedNote = notes.find(n => n.id === selectedId);

  const handleSummarize = () => {
    if (!selectedNote) return;
    resetSummary();
    summarize(selectedNote.content || selectedNote.title);
  };

  if (!hasApiKey) {
    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: colors.background }]}
        edges={['top']}>
        <EmptyState
          icon="🔑"
          title="API Key Required"
          subtitle="Add your OpenAI API key in Settings to use AI features"
          actionLabel="Go to Settings"
          onAction={() => navigation.navigate('SettingsTab' as never)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <LoadingOverlay visible={isLoading} message="Summarizing…" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={[typography.heading, { color: colors.textPrimary }]}>
          AI Summarize
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}>
          Pick a note and let AI extract a summary and action items
        </Text>
        <Pressable
          onPress={() => navigation.navigate('ChatWithNotes')}
          style={{ marginTop: spacing.md }}>
          <Text style={[typography.body, { color: colors.primary }]}>
            💬 Chat with all notes →
          </Text>
        </Pressable>

        {notes.length === 0 ? (
          <View style={{ marginTop: spacing.xxl }}>
            <EmptyState
              icon="📝"
              title="No notes to summarize"
              subtitle="Create a note first, then come back here"
            />
          </View>
        ) : (
          <>
            <Text
              style={[
                typography.subtitle,
                { color: colors.textPrimary, marginTop: spacing.xl },
              ]}>
              Select a note
            </Text>
            <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
              {notes.map(note => (
                <Pressable
                  key={note.id}
                  onPress={() => setSelectedId(note.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
                  <Card
                    style={{
                      borderColor:
                        selectedId === note.id
                          ? colors.primary
                          : colors.border,
                      borderWidth: selectedId === note.id ? 2 : 1,
                    }}>
                    <Text
                      style={[
                        typography.subtitle,
                        { color: colors.textPrimary },
                      ]}
                      numberOfLines={1}>
                      {note.title}
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: spacing.xl }}>
              <Button
                title="Summarize"
                onPress={handleSummarize}
                disabled={!selectedNote}
                loading={isLoading}
              />
            </View>
          </>
        )}

        {error ? (
          <Card
            style={{
              marginTop: spacing.lg,
              borderColor: colors.error,
            }}>
            <Text style={[typography.body, { color: colors.error }]}>
              {error.message}
            </Text>
          </Card>
        ) : null}

        {summaryResult ? (
          <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
            <Card>
              <Text
                style={[
                  typography.subtitle,
                  { color: colors.primary, marginBottom: spacing.sm },
                ]}>
                Summary
              </Text>
              <Text style={[typography.body, { color: colors.textPrimary }]}>
                {summaryResult.summary}
              </Text>
            </Card>

            {summaryResult.actionItems.length > 0 ? (
              <Card>
                <Text
                  style={[
                    typography.subtitle,
                    { color: colors.primary, marginBottom: spacing.sm },
                  ]}>
                  Action Items
                </Text>
                {summaryResult.actionItems.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.actionRow, { marginTop: spacing.sm }]}>
                    <Text style={{ color: colors.success }}>✓</Text>
                    <Text
                      style={[
                        typography.body,
                        { color: colors.textPrimary, flex: 1 },
                      ]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </Card>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
});
