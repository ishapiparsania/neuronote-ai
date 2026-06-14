import { Note } from '@/types/note';
import { ChatMessage } from '@/types/ai';

export const SUMMARIZE_SYSTEM_PROMPT = `You are NeuroNote AI, a helpful assistant that summarizes notes and extracts action items.
Given note content, respond with valid JSON only in this exact format:
{"summary": "brief summary here", "actionItems": ["item 1", "item 2"]}
If there are no action items, return an empty array for actionItems.`;

export const CHAT_SYSTEM_PROMPT = `You are NeuroNote AI, an assistant that helps users understand and organize their notes.
Use the provided notes as context to answer questions accurately.
If the answer is not in the notes, say so clearly.
Be concise and helpful.`;

export function buildNotesContext(notes: Note[]): string {
  if (notes.length === 0) return 'The user has no notes yet.';

  return notes
    .map(
      (note, index) =>
        `Note ${index + 1} — "${note.title}":\n${note.content || '(empty)'}`,
    )
    .join('\n\n');
}

export function buildChatMessages(
  notes: Note[],
  history: ChatMessage[],
  userMessage: string,
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const systemContent = `${CHAT_SYSTEM_PROMPT}\n\n--- USER NOTES ---\n${buildNotesContext(notes)}`;

  const messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [{ role: 'system', content: systemContent }];

  history.slice(-10).forEach(msg => {
    messages.push({ role: msg.role, content: msg.content });
  });

  messages.push({ role: 'user', content: userMessage });
  return messages;
}
