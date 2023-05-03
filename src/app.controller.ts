import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { GetUserId } from './_utils/decorators/get-user-id.decorator';
import { AuthGuard } from './_utils/guards/auth.guard';

@Controller()
export class AppController {
  @Get()
  getHello(@GetUserId() user_id: number, @Res() res: any) {
    if (!user_id) return res.redirect('login');
    return res.redirect('dashboard');
  }

  // Auth
  @Get('login')
  @Render('auth/login.ejs')
  loginView() {}

  @Get('forgot-password')
  @Render('auth/forgot-password.ejs')
  forgotPasswordView() {}

  // Profile
  @Get('profile')
  @UseGuards(AuthGuard)
  @Render('profile/profile.ejs')
  profileView() {}

  @Get('profile/change-password')
  @UseGuards(AuthGuard)
  @Render('profile/change-password.ejs')
  changePasswordView() {}

  // Dashboard
  @Get('dashboard')
  @UseGuards(AuthGuard)
  @Render('dashboard/dashboard.ejs')
  dashboardView() {}

  // User
  @Get('user/create')
  @UseGuards(AuthGuard)
  @Render('user/create-user.ejs')
  createUserView() {}

  @Get('user/list')
  @UseGuards(AuthGuard)
  @Render('user/list-user.ejs')
  listUserView() {}
}
