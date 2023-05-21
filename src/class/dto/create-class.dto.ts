import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString({ message: 'Tên phải là chữ' })
  @IsNotEmpty({ message: 'Tên Không được để trống' })
  name: string;
}
