import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCourseDto {
  @IsNumber({}, { message: 'course_id phải là số' })
  @IsNotEmpty({ message: 'course_id không được để trống' })
  course_id: number;
}
