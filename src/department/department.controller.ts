import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { CreateCourseDto } from 'src/course/dto/create-course.dto';
import { UserRole } from 'src/user/enums/user.enum';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async createDepartment(@Body() body: CreateDepartmentDto, @Res() res: any) {
    const data = await this.departmentService.createDepartment(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAllDepartment(@Res() res: any) {
    const data = await this.departmentService.findAllDepartment();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async findOneDepartment(@Param('id') id: string, @Res() res: any) {
    const data = await this.departmentService.findOneDepartment(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update')
  @Roles(UserRole.ADMIN)
  async updateDepartment(@Body() body: UpdateDepartmentDto, @Res() res: any) {
    const data = await this.departmentService.updateDepartment(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post(':id/delete')
  @Roles(UserRole.ADMIN)
  async removeDepartment(@Param('id') id: string, @Res() res: any) {
    const data = await this.departmentService.removeDepartment(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
