import { NestFactory } from '@nestjs/core';
import 'dotenv/config'
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()
  await app.listen(process.env.PORT)
  Logger.log('Auth microservice running')

}

bootstrap();
