import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';
import { AuthGuard } from 'src/_utils/guards/auth.guard';

@Controller('class')
@UseGuards(AuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getListClass(@Res() res: any) {
    const data = await this.classService.getListClass();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
