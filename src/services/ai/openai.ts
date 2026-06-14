import { SummaryResult } from '@/types/ai';
import { createApiClient, createApiError } from '@/services/api/client';
import { SUMMARIZE_SYSTEM_PROMPT, buildChatMessages } from './prompts';
import { Note } from '@/types/note';
import { ChatMessage } from '@/types/ai';

type ChatCompletionResponse = {
  choices: Array<{ message: { content: string } }>;
};

export class OpenAIService {
  private getApiKey: () => string;

  constructor(getApiKey: () => string) {
    this.getApiKey = getApiKey;
  }

  private getClient() {
    return createApiClient(this.getApiKey);
  }

  async summarizeNote(content: string): Promise<SummaryResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw createApiError(new Error('API key not configured'));
    }

    try {
      const client = this.getClient();
      const response = await client.post<ChatCompletionResponse>(
        '/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
            { role: 'user', content },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        },
      );

      const raw = response.data.choices[0]?.message?.content;
      if (!raw) {
        throw new Error('OpenAI returned an empty summary response.');
      }

      let parsed: Partial<SummaryResult>;
      try {
        parsed = JSON.parse(raw) as Partial<SummaryResult>;
      } catch {
        throw new Error('OpenAI returned invalid summary JSON.');
      }

      return {
        summary: parsed.summary ?? 'No summary available.',
        actionItems: Array.isArray(parsed.actionItems)
          ? parsed.actionItems
          : [],
      };
    } catch (error) {
      throw createApiError(error);
    }
  }

  async chatWithNotes(
    notes: Note[],
    history: ChatMessage[],
    userMessage: string,
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw createApiError(new Error('API key not configured'));
    }

    try {
      const client = this.getClient();
      const messages = buildChatMessages(notes, history, userMessage);
      const response = await client.post<ChatCompletionResponse>(
        '/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.5,
        },
      );

      return (
        response.data.choices[0]?.message?.content ??
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      throw createApiError(error);
    }
  }
}
