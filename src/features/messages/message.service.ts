import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './models/message.entity';
import { CreateMessageDto } from './dtos/crete-message.dto';
import { EventsGateway } from '../../infra/websocket/events.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createMessage(message: CreateMessageDto): Promise<Message> {
    const createdMessage = this.messageRepository.create({ ...message });
    const sendedMessage = await this.messageRepository.save(createdMessage);

    this.eventsGateway.sendMessageToUser(message.para, {
      de: message.de,
      texto: message.texto,
      id: sendedMessage.id,
      createdAt: sendedMessage.createdAt,
    });

    return sendedMessage;
  }

  async getConversation(de: number, para: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { de, para },
        { de: para, para: de },
      ],
      order: { createdAt: 'ASC' },
    });
  }
}