import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString({ message: 'Tên phải là chữ' })
  @IsNotEmpty({ message: 'Tên Không được để trống' })
  name: string;

  @IsNumber({}, { message: 'Số tín chỉ phải là số' })
  @IsNotEmpty({ message: 'Số tín chỉ Không được để trống' })
  no_of_credit: number;
}
