import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { ScoreEntity } from 'src/score/entities/score.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity, ScoreEntity, UserEntity])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
