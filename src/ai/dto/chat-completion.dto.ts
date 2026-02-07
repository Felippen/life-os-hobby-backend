export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatCompletionDto {
  conversationHistory: Message[];
  newMessage: string;
}
