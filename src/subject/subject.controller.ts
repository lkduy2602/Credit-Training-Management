import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { UserRole } from 'src/user/enums/user.enum';
import { AddUserSubjectDto } from './dto/add-user-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { DeleteSubjectDto } from './dto/delete-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';
import { DeleteUserSubjectDto } from './dto/delete-user-subject.dto';
import { GetUserId } from 'src/_utils/decorators/get-user-id.decorator';
import { DeleteSubjectUserRegisterDto } from './dto/delete-subject-user-register.dto';

@Controller('subject')
@UseGuards(AuthGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async createSubject(@Body() body: CreateSubjectDto, @Res() res: any) {
    await this.subjectService.createSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAllSubject(@Res() res: any) {
    const data = await this.subjectService.findAllSubject();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async findOneSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.subjectService.findOneSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update')
  @Roles(UserRole.ADMIN)
  async updateSubject(@Body() body: UpdateSubjectDto, @Res() res: any) {
    await this.subjectService.updateSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('delete')
  @Roles(UserRole.ADMIN)
  async removeSubject(@Body() body: DeleteSubjectDto, @Res() res: any) {
    await this.subjectService.removeSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('add-user')
  @Roles(UserRole.ADMIN)
  async addUserSubject(@Body() body: AddUserSubjectDto, @Res() res: any) {
    await this.subjectService.addUserSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('delete-user')
  @Roles(UserRole.ADMIN)
  async deleteUserSubject(@Body() body: DeleteUserSubjectDto, @Res() res: any) {
    await this.subjectService.deleteUserSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get(':id/user-in')
  async findAllUserInSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.subjectService.findAllUserInSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/user-not-in')
  @Roles(UserRole.ADMIN)
  async findAllUserNotInSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.subjectService.findAllUserNotInSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('user-register')
  @Roles(UserRole.USER)
  async findAllSubjectUserRegister(@GetUserId() user_id: number, @Res() res: any) {
    const data = await this.subjectService.findAllSubjectUserRegister(+user_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('user-register/delete')
  @Roles(UserRole.USER)
  async deleteSubjectUserRegister(@GetUserId() user_id: number, @Body() body: DeleteSubjectUserRegisterDto, @Res() res: any) {
    const data = await this.subjectService.deleteSubjectUserRegister(+user_id, body.subject_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
