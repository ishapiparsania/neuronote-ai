export type SummaryResult = {
  summary: string;
  actionItems: string[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type ChatRole = ChatMessage['role'];
