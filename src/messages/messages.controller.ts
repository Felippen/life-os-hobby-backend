import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, AccessToken } from '../auth/auth.decorator';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @AccessToken() token: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(user.id, token, dto);
  }

  @Get('conversation/:conversationId')
  findByConversation(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: any,
    @AccessToken() token: string,
    @Query('limit') limit?: number,
  ) {
    return this.messagesService.findByConversation(
      conversationId,
      user.id,
      token,
      limit,
    );
  }
}
