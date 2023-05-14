import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { UpdateScoreDto } from './dto/update-score.dto';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scoreService.findOne(+id);
  }

  @Post(':id')
  async updateScoreUser(@Body() body: UpdateScoreDto, @Res() res:any) {
    await this.scoreService.updateScoreUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }
}
