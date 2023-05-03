import { IsNotEmpty, Matches } from 'class-validator';
import { UserGender } from 'src/user/enums/user.enum';

export class UpdateProfileDto {
  @IsNotEmpty({
    message: 'Họ không được để trống',
  })
  first_name: string;

  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  last_name: string;

  @IsNotEmpty({
    message: 'Sinh nhật không được để trống',
  })
  birthday: string;

  @IsNotEmpty({
    message: 'Giới tính không được để trống',
  })
  gender: UserGender;

  address: string;

  @Matches(/(\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}/g, {
    message: 'Số điện thoại không đúng định dạng',
  })
  @IsNotEmpty({
    message: 'Số điện thoại không được để trống',
  })
  phone: string;

  avatar: string;
}
