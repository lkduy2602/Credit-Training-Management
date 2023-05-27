import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Tên phải là chữ' })
  @IsNotEmpty({ message: 'Tên Không được để trống' })
  name: string;

  @IsString({ message: 'Địa chỉ phải là chữ' })
  @IsNotEmpty({ message: 'Địa chỉ Không được để trống' })
  address: string;

  @Matches(/(\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}/g, {
    message: 'Số điện thoại không đúng định dạng',
  })
  phone: string;
}
