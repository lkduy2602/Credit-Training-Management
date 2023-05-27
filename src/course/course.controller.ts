import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';
import { DeleteCourseDto } from './dto/delete-department.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async createCourse(@Body() body: CreateCourseDto, @Res() res: any) {
    const data = await this.courseService.createCourse(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAllCourse(@Res() res: any) {
    const data = await this.courseService.findAllCourse();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async findOneCourse(@Param('id') id: string, @Res() res: any) {
    const data = await this.courseService.findOneCourse(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('update')
  @Roles(UserRole.ADMIN)
  async updateCourse(@Body() body: UpdateCourseDto, @Res() res: any) {
    const data = await this.courseService.updateCourse(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('delete')
  @Roles(UserRole.ADMIN)
  async removeCourse(@Body() body: DeleteCourseDto, @Res() res: any) {
    const data = await this.courseService.removeCourse(+body.course_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
