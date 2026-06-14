import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '@/theme';
import { EmptyState, ScreenHeader } from '@/components/ui';
import { useAI } from '@/hooks/useAI';
import { ChatMessage } from '@/types/ai';

function ChatBubble({ message }: { message: ChatMessage }) {
  const { colors, typography, spacing } = useAppTheme();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.bubbleRow,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.userBubble : colors.aiBubble,
            borderColor: isUser ? colors.userBubble : colors.border,
            padding: spacing.md,
            maxWidth: '80%',
          },
        ]}>
        <Text
          style={[
            typography.body,
            { color: isUser ? '#FFFFFF' : colors.textPrimary },
          ]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  const { colors, spacing } = useAppTheme();
  return (
    <View style={[styles.bubbleRow, { justifyContent: 'flex-start' }]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: colors.aiBubble,
            borderColor: colors.border,
            padding: spacing.md,
          },
        ]}>
        <Text style={{ color: colors.textSecondary }}>Thinking…</Text>
      </View>
    </View>
  );
}

export function ChatScreen() {
  const { colors, typography, spacing } = useAppTheme();
  const navigation = useNavigation();
  const {
    chatMessages,
    sendChatMessage,
    isLoading,
    error,
    hasApiKey,
    clearChat,
  } = useAI();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendChatMessage(trimmed);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!hasApiKey) {
    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: colors.background }]}
        edges={['top']}>
        <EmptyState
          icon="🔑"
          title="API Key Required"
          subtitle="Add your Gemini API key in Settings to chat with your notes"
          actionLabel="Go to Settings"
          onAction={() => navigation.navigate('SettingsTab' as never)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}>
      <ScreenHeader
        title="Chat With Notes"
        showBack
        rightAction={
          chatMessages.length > 0
            ? { label: 'Clear', onPress: clearChat }
            : undefined
        }
      />

      {chatMessages.length === 0 && !isLoading ? (
        <EmptyState
          icon="💬"
          title="Ask anything about your notes"
          subtitle='Try "What tasks are pending?" or "Summarize my meeting notes"'
        />
      ) : (
        <FlatList
          ref={listRef}
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={isLoading ? TypingIndicator : null}
        />
      )}

      {error ? (
        <Text
          style={[
            typography.caption,
            {
              color: colors.error,
              textAlign: 'center',
              paddingHorizontal: spacing.lg,
            },
          ]}>
          {error.message}
        </Text>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View
          style={[
            styles.inputRow,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your notes…"
            placeholderTextColor={colors.placeholder}
            style={[
              typography.body,
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: colors.primary,
                opacity: !input.trim() || isLoading ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}>
            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bubbleRow: { flexDirection: 'row', marginBottom: 4 },
  bubble: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
