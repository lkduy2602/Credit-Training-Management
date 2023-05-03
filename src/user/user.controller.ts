import { Controller, Body, Res, HttpStatus, Post, UseGuards, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from './enums/user.enum';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  async createUser(@Body() body: CreateUserDto, @Res() res: any) {
    await this.userService.createUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('update')
  @Roles(UserRole.ADMIN)
  async updateUser(@Body() body: UpdateUserDto, @Res() res: any) {
    await this.userService.updateUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('delete')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Body() body: DeleteUserDto, @Res() res: any) {
    await this.userService.deleteUser(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get(':id/detail')
  @Roles(UserRole.ADMIN)
  async getDetailUser(@Param('id') user_id: number, @Res() res: any) {
    const data = await this.userService.getDetailUser(user_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getListUser(@Res() res: any) {
    const data = await this.userService.getListUser();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
