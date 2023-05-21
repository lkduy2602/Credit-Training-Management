import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { UpdateScoreDto } from './dto/update-score.dto';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':id/subject')
  async findAllScoreInSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.scoreService.findAllScoreInSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  async findOneScore(@Param('id') id: string, @Res() res: any) {
    const data = await this.scoreService.findOneScore(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update-user')
  async updateScoreUser(@Body() body: UpdateScoreDto, @Res() res: any) {
    await this.scoreService.updateScoreUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }
}
