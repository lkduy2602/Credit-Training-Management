import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { UpdateScoreDto } from './dto/update-score.dto';
import { ScoreService } from './score.service';
import { GetUserId } from 'src/_utils/decorators/get-user-id.decorator';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';

@Controller('score')
@UseGuards(AuthGuard)
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':id/subject')
  @Roles(UserRole.ADMIN)
  async findAllScoreInSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.scoreService.findAllScoreInSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async findOneScore(@Param('id') id: string, @Res() res: any) {
    const data = await this.scoreService.findOneScore(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update-user')
  @Roles(UserRole.ADMIN)
  async updateScoreUser(@Body() body: UpdateScoreDto, @Res() res: any) {
    await this.scoreService.updateScoreUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get('user-score')
  @Roles(UserRole.USER)
  async findAllScoreInUser(@GetUserId() user_id: number, @Res() res: any) {
    const data = await this.scoreService.findAllScoreInUser(+user_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('total-score-user')
  @Roles(UserRole.USER)
  async totalScoreInUser(@GetUserId() user_id: number, @Res() res: any) {
    const data = await this.scoreService.totalScoreInUser(+user_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
