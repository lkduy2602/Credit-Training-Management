import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './_utils/exceptions/filter.exception';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { ConfigOptionModule } from './config/config.module';
import { ScoreModule } from './score/score.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [ConfigOptionModule, AuthModule, UserModule, ClassModule, SubjectModule, ScoreModule, CourseModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
