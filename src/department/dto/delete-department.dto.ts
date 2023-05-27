import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteDepartmentDto {
  @IsNumber({}, { message: 'department_id phải là số' })
  @IsNotEmpty({ message: 'department_id không được để trống' })
  department_id: number;
}
