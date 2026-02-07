import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AiService } from '../ai/ai.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private supabaseService: SupabaseService,
    private aiService: AiService,
  ) {}

  async create(userId: string, accessToken: string, dto: CreateMessageDto) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    // 1. Verify conversation exists and belongs to user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, title')
      .eq('id', dto.conversation_id)
      .eq('user_id', userId)
      .single();

    if (convError || !conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Get conversation history for AI context
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', dto.conversation_id)
      .order('created_at', { ascending: true });

    if (historyError) {
      throw new Error(
        `Failed to fetch conversation history: ${historyError.message}`,
      );
    }

    // 3. Save user message
    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: dto.conversation_id,
        role: 'user',
        content: dto.content,
      })
      .select()
      .single();

    if (userMsgError) {
      throw new Error(`Failed to save user message: ${userMsgError.message}`);
    }

    // 4. Generate AI response with conversation context
    const aiResponse = await this.aiService.generateChatCompletion({
      conversationHistory: history || [],
      newMessage: dto.content,
    });

    // 5. Save AI response
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: dto.conversation_id,
        role: 'assistant',
        content: aiResponse,
      })
      .select()
      .single();

    if (assistantMsgError) {
      throw new Error(
        `Failed to save assistant message: ${assistantMsgError.message}`,
      );
    }

    // 6. If this is the first message, generate a title
    if (!history || history.length === 0) {
      const title = await this.aiService.generateTitle(dto.content);

      await supabase
        .from('conversations')
        .update({
          title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dto.conversation_id);
    } else {
      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', dto.conversation_id);
    }

    // 7. Return both messages
    return {
      user_message: userMessage,
      assistant_message: assistantMessage,
    };
  }

  async findByConversation(
    conversationId: string,
    userId: string,
    accessToken: string,
    limit?: number,
  ) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Get messages
    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    const limitNum =
      limit != null && !isNaN(Number(limit)) ? Number(limit) : undefined;
    if (limitNum) {
      query = query.limit(limitNum);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return {
      data: data || [],
      has_more: false, // Can implement pagination later if needed
    };
  }
}
