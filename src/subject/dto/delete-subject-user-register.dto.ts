import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteSubjectUserRegisterDto {
  @IsNumber({}, { message: 'subject_id phải là số' })
  @IsNotEmpty({ message: 'subject_id không được để trống' })
  subject_id: number;
}
