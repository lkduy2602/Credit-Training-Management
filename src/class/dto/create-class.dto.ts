import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString({ message: 'Tên phải là chữ' })
  @IsNotEmpty({ message: 'Tên Không được để trống' })
  name: string;

  // @IsNumber({}, { message: 'department_id phải là số' })
  @IsNotEmpty({ message: 'department_id không được để trống' })
  department_id: number;

  // @IsNumber({}, { message: 'course_id phải là số' })
  @IsNotEmpty({ message: 'course_id không được để trống' })
  course_id: number;
}
