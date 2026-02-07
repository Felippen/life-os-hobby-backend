import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, AccessToken } from '../auth/auth.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListConversationsDto } from './dto/list-conversations.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @AccessToken() token: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, token, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @AccessToken() token: string,
    @Query() dto: ListConversationsDto,
  ) {
    return this.conversationsService.findAll(user.id, token, dto);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @AccessToken() token: string,
  ) {
    return this.conversationsService.findOne(id, user.id, token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @AccessToken() token: string,
  ) {
    return this.conversationsService.remove(id, user.id, token);
  }
}
