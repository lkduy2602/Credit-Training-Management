import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { UserRole, UserStatus } from 'src/user/enums/user.enum';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponse } from 'src/user/responses/user.reponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly mailerService: MailerService,
  ) {}

  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.userRepository.findOneBy({
      email,
      password,
      status: UserStatus.ACTIVE,
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tài khoản hoặc mật khẩu không đúng');

    return user.user_id;
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const { email } = body;

    const user = await this.userRepository.findOneBy({
      email,
      status: UserStatus.ACTIVE,
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Không có user nào có email này');

    const new_password = this.generatePassword();

    await this.userRepository.update(
      {
        email,
      },
      {
        password: new_password,
      },
    );

    await this.mailerService.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Quên mật khẩu',
      html: `<h1><strong>Mật khẩu mới của bạn là: </strong></h1> ${new_password}`,
    });
  }

  async changePassword(user_id: number, body: ChangePasswordDto) {
    const { password, new_password } = body;

    const check_old_password = await this.userRepository.findOneBy({
      password,
      user_id,
    });
    if (!check_old_password) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Mật khẩu cũ không đúng');

    await this.userRepository.update(
      {
        user_id,
      },
      {
        password: new_password,
      },
    );
  }

  async updateProfile(user_id: number, body: UpdateProfileDto) {
    const { address, avatar, birthday, first_name, gender, last_name, phone } = body;

    await this.userRepository.update(
      {
        user_id,
      },
      {
        address,
        avatar,
        birthday,
        first_name,
        gender,
        last_name,
        phone,
      },
    );
  }

  async getProfile(user_id: number) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });

    return new UserResponse(user);
  }

  //===================================Support Functions===================================
  generatePassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    let password = '';
    password += chars.charAt(Math.floor(Math.random() * chars.length));
    password += nums.charAt(Math.floor(Math.random() * nums.length));
    for (let i = 0; i < 4; i++) {
      const randomChar = chars.concat(nums).charAt(Math.floor(Math.random() * (chars.length + nums.length)));
      password += randomChar;
    }
    return password;
  }

  // async autoCreateAdmin() {
  //   const userList = await this.userRepository.find({});
  //   if (userList || userList.length !== 0) return;

  //   const user = this.userRepository.create({
  //     email: 'admin@gmail.com',
  //     password: 'admin123',
  //     first_name: 'Super',
  //     last_name: 'Admin',
  //     phone: '039000000',
  //     role: UserRole.ADMIN,
  //   });
  //   await this.userRepository.save(user);
  // }
}
