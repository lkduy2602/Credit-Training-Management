import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from 'src/class/entities/class.entity';
import { CourseEntity } from 'src/course/entities/course.entity';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { ScoreEntity } from 'src/score/entities/score.entity';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [UserEntity, ClassEntity, SubjectEntity, ScoreEntity, CourseEntity, DepartmentEntity],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  ],
})
export class ConfigOptionModule {}
