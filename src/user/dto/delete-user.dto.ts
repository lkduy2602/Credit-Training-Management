import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteUserDto {
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
}
