import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dtos/crete-message.dto';

@Processor('messages')
export class MessagesProcessor {
  constructor(private readonly messagesService: MessageService) {}

  @Process('save-message')
  async handleMessage(job: Job<CreateMessageDto>) {
    console.log('Processando mensagem:', job.data);
    await this.messagesService.createMessage(job.data);
  }
}
