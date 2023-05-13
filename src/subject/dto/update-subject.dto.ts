import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsNumber({}, { message: 'subject_id phải là số' })
  @IsNotEmpty({ message: 'subject_id không được để trống' })
  subject_id: number;
}
