import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ClassEntity } from 'src/class/entities/class.entity';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { ScoreEntity } from 'src/score/entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity, UserEntity, ClassEntity, DepartmentEntity, ScoreEntity])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
