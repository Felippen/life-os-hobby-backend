import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ChatCompletionDto } from './dto/chat-completion.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);

    // Using gemini-pro model
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
    });
  }

  async generateChatCompletion(dto: ChatCompletionDto): Promise<string> {
    try {
      // Build the conversation history for Gemini
      const history = dto.conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Start a chat session with history
      const chat = this.model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
        },
      });

      // Send the new message
      const result = await chat.sendMessage(dto.newMessage);
      const response = await result.response;
      const text = response.text();

      this.logger.log(`Generated response: ${text.substring(0, 100)}...`);

      return text;
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);

      // Provide a fallback response
      return "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const prompt = `Generate a short, descriptive title (max 6 words) for a conversation that starts with this message: "${firstMessage}". Only respond with the title, nothing else.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const title = response.text().trim();

      // Ensure title isn't too long
      return title.length > 60 ? title.substring(0, 57) + '...' : title;
    } catch (error) {
      this.logger.error('Failed to generate title', error);
      return 'New Chat';
    }
  }
}
