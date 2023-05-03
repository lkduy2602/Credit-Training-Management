import { IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/, {
    message: 'Mật khẩu phải bao gồm chữ, số và có độ dài từ 6 đến 20 ký tự',
  })
  password: string;

  @IsNotEmpty({
    message: 'Mật khẩu mới không được để trống',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/, {
    message: 'Mật khẩu mới phải bao gồm chữ, số và có độ dài từ 6 đến 20 ký tự',
  })
  new_password: string;
}
