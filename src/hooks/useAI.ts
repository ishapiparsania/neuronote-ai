import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { GeminiService } from '@/services/ai/gemini';
import { SummaryResult, ChatMessage } from '@/types/ai';
import { ApiError } from '@/types/api';
import { createApiError } from '@/services/api/client';
import { generateId } from '@/utils/uuid';
import { Note } from '@/types/note';

export function useAI() {
  const apiKey = useSelector((state: RootState) => state.settings.openaiApiKey);
  const notes = useSelector((state: RootState) => state.notes.notes);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const service = useMemo(
    () => new GeminiService(() => apiKey),
    [apiKey],
  );

  const hasApiKey = apiKey.trim().length > 0;

  const summarize = useCallback(
    async (content: string) => {
      if (!hasApiKey) {
        setError({
          code: 'NO_API_KEY',
          message: 'Add your Gemini API key in Settings',
        });
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await service.summarizeNote(content);
        setSummaryResult(result);
      } catch (err) {
        setError(createApiError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [hasApiKey, service],
  );

  const sendChatMessage = useCallback(
    async (message: string) => {
      if (!hasApiKey) {
        setError({
          code: 'NO_API_KEY',
          message: 'Add your Gemini API key in Settings',
        });
        return;
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };

      setChatMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.chatWithNotes(
          notes as Note[],
          chatMessages,
          message,
        );
        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response,
          createdAt: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } catch (err) {
        setError(createApiError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [hasApiKey, service, notes, chatMessages],
  );

  const resetSummary = useCallback(() => {
    setSummaryResult(null);
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    summaryResult,
    chatMessages,
    hasApiKey,
    summarize,
    sendChatMessage,
    resetSummary,
    clearChat,
  };
}
