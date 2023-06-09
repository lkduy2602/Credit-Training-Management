/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Render, Res, UseGuards } from '@nestjs/common';
import { GetUserId } from './_utils/decorators/get-user-id.decorator';
import { AuthGuard } from './_utils/guards/auth.guard';
import { Roles } from './_utils/decorators/roles.decorator';
import { UserRole } from './user/enums/user.enum';

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
  @Get('user/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('user/list-user.ejs')
  listUserView() {}

  // Subject
  @Get('subject/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('subject/list-subject.ejs')
  listSubjectView() {}

  // Score
  @Get('score/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('score/list-score.ejs')
  listScoreView() {}

  @Get('score/user-score/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('score/user-score.ejs')
  listUserScoreView() {}

  // Class
  @Get('class/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('class/list-class.ejs')
  listClassView() {}

  // Department
  @Get('department/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('department/list-department.ejs')
  listDepartmentView() {}

  // Course
  @Get('course/list')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @Render('course/list-course.ejs')
  listCourseView() {}

  //User
  // Subject
  @Get('subject/list/user')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  @Render('subject/list-subject-user.ejs')
  listSubjectUserView() {}

  @Get('score/list/user')
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  @Render('score/list-score-user.ejs')
  listScoreUserView() {}
}
