import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
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
}
