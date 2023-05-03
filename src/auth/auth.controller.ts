import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/_utils/exceptions/base-response.exception';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from 'src/_utils/guards/auth.guard';
import { Roles } from 'src/_utils/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUserId } from 'src/_utils/decorators/get-user-id.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: any) {
    const data = await this.authService.login(body);
    res.cookie('user_id', data);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Res() res: any) {
    res.clearCookie('user_id');
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: any) {
    await this.authService.forgotPassword(body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@GetUserId() user_id: number, @Body() body: ChangePasswordDto, @Res() res: any) {
    await this.authService.changePassword(user_id, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('update-profile')
  @UseGuards(AuthGuard)
  async updateProfile(@GetUserId() user_id: number, @Body() body: UpdateProfileDto, @Res() res: any) {
    await this.authService.updateProfile(user_id, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@GetUserId() user_id: number, @Res() res: any) {
    const data = await this.authService.getProfile(user_id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
