import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';
import { query } from 'express';
import { DeleteSubjectDto } from './dto/delete-subject.dto';

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
  async findAllSubject(@Res() res: any) {
    const data = await this.subjectService.findAllSubject();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  async findOneSubject(@Param('id') id: string, @Res() res: any) {
    const data = await this.subjectService.findOneSubject(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update')
  async updateSubject(@Body() body: UpdateSubjectDto, @Res() res: any) {
    await this.subjectService.updateSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('delete')
  async removeSubject(@Body() body: DeleteSubjectDto, @Res() res: any) {
    await this.subjectService.removeSubject(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }
}
