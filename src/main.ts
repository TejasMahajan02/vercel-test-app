import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'], });
  await app.listen(process.env.NODE_PORT || 3000, '0.0.0.0');
  const logger = new Logger('App');
  logger.warn(`Application Is is running on ${await app.getUrl()}`);
}
bootstrap();
