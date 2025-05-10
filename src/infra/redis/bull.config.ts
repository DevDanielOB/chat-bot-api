import { BullModule } from '@nestjs/bull';

export const BullQueueModule = BullModule.forRoot({
  redis: {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT ?? '6379'),
  },
});
