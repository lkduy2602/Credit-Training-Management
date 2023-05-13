import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigOptionModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './_utils/exceptions/filter.exception';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { ScoreModule } from './score/score.module';
import { SemesterModule } from './semester/semester.module';

@Module({
  imports: [ConfigOptionModule, AuthModule, UserModule, ClassModule, SubjectModule, ScoreModule, SemesterModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
