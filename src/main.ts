import { NestFactory } from '@nestjs/core';
import 'dotenv/config'
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Masterdata CLi API')
    .setDescription('Masterdata API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors()
  await app.listen(process.env.PORT)
  Logger.log('Auth microservice running')

}

bootstrap();
