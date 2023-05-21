import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsNumber({}, { message: 'class_id phải là số' })
  @IsNotEmpty({ message: 'class_id không được để trống' })
  class_id: number;
}
