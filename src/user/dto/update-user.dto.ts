import { IsEnum, IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { UserGender, UserRole } from '../enums/user.enum';

export class UpdateUserDto {
  @IsNumber(
    {},
    {
      message: 'Id phải là số',
    },
  )
  @IsNotEmpty({
    message: 'Id không được để trống',
  })
  user_id: number;

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
  phone: string;

  @IsNotEmpty({ message: 'Lớp không được để trống' })
  class_id: number;

  avatar: string;

  @IsEnum(UserRole, {
    message: 'Quyền không đúng',
  })
  @IsNotEmpty({
    message: 'Quyền không được để trống',
  })
  role: UserRole;
}
