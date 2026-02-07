import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListConversationsDto } from './dto/list-conversations.dto';

@Injectable()
export class ConversationsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, accessToken: string, dto: CreateConversationDto) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: dto.title || 'New Chat',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data;
  }

  async findAll(userId: string, accessToken: string, dto: ListConversationsDto) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;
    const sort = dto.sort ?? 'updated_at';
    const order = dto.order ?? 'desc';

    // Get total count
    const { count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get conversations with pagination
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return {
      data,
      total: count || 0,
      limit,
      offset,
    };
  }

  async findOne(
    conversationId: string,
    userId: string,
    accessToken: string,
  ) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    // Get conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Get messages for this conversation
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) {
      throw new Error(`Failed to fetch messages: ${msgError.message}`);
    }

    return {
      ...conversation,
      messages: messages || [],
    };
  }

  async remove(
    conversationId: string,
    userId: string,
    accessToken: string,
  ) {
    const supabase = this.supabaseService.getClientWithAuth(accessToken);

    // First check if conversation exists and belongs to user
    const { data: conversation, error: findError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (findError || !conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Delete conversation (messages will cascade delete due to FK constraint)
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }

    return { deleted: true };
  }
}
