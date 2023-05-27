import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @IsNumber({}, { message: 'course_id phải là số' })
  @IsNotEmpty({ message: 'course_id không được để trống' })
  department_id: number;
}
