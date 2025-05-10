import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateMessageDto } from './dtos/crete-message.dto';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    @InjectQueue('messages') private messagesQueue: Queue,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    await this.messagesQueue.add('save-message', dto);
    return { status: 'Mensagem enfileirada com sucesso' };
  }

  @Get()
  async getMessages(
    @Query('de') de: number,
    @Query('para') para: number,
  ) {
    const messages = await this.messageService.getConversation(de, para);
    return messages;
  }
}
