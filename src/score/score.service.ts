import { Injectable } from '@nestjs/common';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoreService {

  findAll() {
    return `This action returns all score`;
  }

  findOne(id: number) {
    return `This action returns a #${id} score`;
  }

  updateScoreUser(body: UpdateScoreDto) {
    
  }
}
