import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // to hide the user information when making requests
  // app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(4000);
}

bootstrap();
