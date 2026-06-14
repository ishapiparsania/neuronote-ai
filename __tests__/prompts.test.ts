import { buildNotesContext, buildChatMessages } from '@/services/ai/prompts';
import { Note } from '@/types/note';

const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting',
    content: 'Discuss payment flow',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('buildNotesContext', () => {
  it('returns empty message when no notes', () => {
    expect(buildNotesContext([])).toBe('The user has no notes yet.');
  });

  it('includes note title and content', () => {
    const context = buildNotesContext(sampleNotes);
    expect(context).toContain('Meeting');
    expect(context).toContain('Discuss payment flow');
  });
});

describe('buildChatMessages', () => {
  it('includes system context and user message', () => {
    const messages = buildChatMessages(sampleNotes, [], 'What tasks are pending?');
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toContain('Meeting');
    expect(messages[messages.length - 1]).toEqual({
      role: 'user',
      content: 'What tasks are pending?',
    });
  });
});
