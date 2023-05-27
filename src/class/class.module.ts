import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/course/entities/course.entity';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassEntity } from './entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, UserEntity, CourseEntity, DepartmentEntity])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
