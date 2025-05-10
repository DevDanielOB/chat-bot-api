import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { MessagesController } from './messages.controller';
import { MessageService } from './message.service';
import { MessagesProcessor } from './message-processor';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsGateway } from 'src/infra/websocket/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    BullModule.registerQueue({
      name: 'messages',
    }),
    JwtModule,
    EventsGateway,
  ],
  controllers: [MessagesController],
  providers: [MessageService, MessagesProcessor, JwtAuthGuard, EventsGateway],
})
export class MessagesModule {}
