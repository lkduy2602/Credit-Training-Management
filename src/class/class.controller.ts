import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { UserRole } from 'src/user/enums/user.enum';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
@UseGuards(AuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async createClass(@Body() body: CreateClassDto, @Res() res: any) {
    const data = await this.classService.createClass(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getListClass(@Res() res: any) {
    const data = await this.classService.getListClass();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async findOneClass(@Param('id') id: string, @Res() res: any) {
    const data = await this.classService.findOneClass(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update')
  @Roles(UserRole.ADMIN)
  async updateClass(@Body() body: UpdateClassDto, @Res() res: any) {
    const data = await this.classService.updateClass(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('delete')
  @Roles(UserRole.ADMIN)
  async deleteClass(@Body() body: DeleteClassDto, @Res() res: any) {
    const data = await this.classService.deleteClass(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/user-in')
  @Roles(UserRole.ADMIN)
  async findAllUserInClass(@Param('id') id: string, @Res() res: any) {
    const data = await this.classService.findAllUserInClass(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
