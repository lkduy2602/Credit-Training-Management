import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class AddUserSubjectDto {
  @IsNumber({}, { message: 'subject_id phải là số' })
  @IsNotEmpty({ message: 'subject_id không được để trống' })
  subject_id: number;

  @IsNotEmpty({ message: 'user_ids không được để trống' })
  @IsArray({
    message: 'Phải truyền lên 1 mảng',
  })
  @ArrayNotEmpty({
    message: 'Hãy chọn sinh viên'
  })
  user_ids: number[];
}
