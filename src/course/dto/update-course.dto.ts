import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsNumber({}, { message: 'course_id phải là số' })
  @IsNotEmpty({ message: 'course_id không được để trống' })
  course_id: number;
}
