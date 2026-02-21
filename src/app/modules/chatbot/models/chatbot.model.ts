export interface Conversation {
  id: number;
  title: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id?: string;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
