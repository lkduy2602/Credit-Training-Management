import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { ClassEntity } from 'src/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, ClassEntity])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
