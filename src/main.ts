import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('API de Usuários')
    .setDescription('API para gerenciar usuários')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/swagger`);
}
bootstrap();
