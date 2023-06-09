import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GetUserId } from 'src/_utils/decorators/get-user-id.decorator';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { AuthGuard } from 'src/_utils/guards/auth.guard';

@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('no-of-all')
  async getNoOfAll(@Res() res: any) {
    const data = await this.reportService.getNoOfAll();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('no-of-student-subject')
  @Roles(UserRole.ADMIN)
  async getNoOfStudentsRegisteredForSubject(@Res() res: any) {
    const data = await this.reportService.getNoOfStudentsRegisteredForSubject();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('no-of-student-department')
  @Roles(UserRole.ADMIN)
  async getNoOfStudentsRegisteredByCourse(@Res() res: any) {
    const data = await this.reportService.getNoOfStudentsRegisteredByDepartment();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
