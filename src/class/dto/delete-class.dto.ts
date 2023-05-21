import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteClassDto {
  @IsNumber({}, { message: 'class_id phải là số' })
  @IsNotEmpty({ message: 'class_id không được để trống' })
  class_id: number;
}
