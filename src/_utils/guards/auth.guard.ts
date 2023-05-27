import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enums/user.enum';
import { DataSource } from 'typeorm';
import { ExceptionResponse } from '../exceptions/error-response.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource, private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const user_id = +req.cookies['user_id'];
    if (!user_id) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Bạn phải đăng nhập trước');
    }
    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: { user_id, status: UserStatus.ACTIVE },
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');

    if (!roles || roles.length === 0 || roles.includes(user.role)) {
      return true;
    } else {
      throw new ExceptionResponse(HttpStatus.FORBIDDEN, 'Bạn không có quyền truy cập');
    }
  }
}
