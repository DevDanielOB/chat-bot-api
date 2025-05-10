import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullQueueModule } from './infra/redis/bull.config';
import { databaseModule } from './database/database.config';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { MessagesModule } from './features/messages/message.module';
import { EventsGateway } from './infra/websocket/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    databaseModule,
    BullQueueModule,
    UsersModule,
    AuthModule,
    MessagesModule,
    EventsGateway
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
