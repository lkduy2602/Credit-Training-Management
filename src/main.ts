import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const userService = app.get(UserService);
  userService.generateUserIfEmpty();

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
  console.log(`🚀 Application running on ~ ${PROTOCOL}://${HOST}:${PORT}/`);
}
bootstrap();
