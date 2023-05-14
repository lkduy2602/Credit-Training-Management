import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteSubjectDto {
  @IsNumber({}, { message: 'subject_id phải là số' })
  @IsNotEmpty({ message: 'subject_id không được để trống' })
  subject_id: number;
}
