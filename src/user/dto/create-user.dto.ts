import { IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { UserGender, UserRole } from '../enums/user.enum';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email: string;

  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/, {
    message: 'Mật khẩu phải bao gồm chữ, số và có độ dài từ 6 đến 20 ký tự',
  })
  password: string;

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

  avatar: string;

  class_id: number;

  @IsEnum(UserRole, {
    message: 'Quyền không đúng',
  })
  @IsNotEmpty({
    message: 'Quyền không được để trống',
  })
  role: UserRole;
}
