import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntity } from './entities/score.entity';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreEntity, SubjectEntity, UserEntity])],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
