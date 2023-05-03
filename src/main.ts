import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const PROTOCOL = process.env.PROTOCOL || 'http';
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 8888;
  
  await app.listen(PORT);
  console.log(`🚀 ~ ${PROTOCOL}://${HOST}:${PORT}/`);
}
bootstrap();
