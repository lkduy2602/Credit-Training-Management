import { IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class PostSubjectUserRegisterDto {
  @IsNotEmpty({ message: 'subject_ids không được để trống' })
  @IsArray({
    message: 'Phải truyền lên 1 mảng',
  })
  @ArrayNotEmpty({
    message: 'Hãy chọn môn học',
  })
  subject_ids: number[];
}
