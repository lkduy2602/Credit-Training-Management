import * as moment from 'moment';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, UserStatus } from './enums/user.enum';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UserResponse } from './responses/user.reponse';
import { ClassEntity } from 'src/class/entities/class.entity';
import { ClassStatus } from 'src/class/enums/class.enum';
import { LitUserResponse } from './responses/list-user.reponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async createUser(body: CreateUserDto) {
    const { address, avatar, email, first_name, gender, last_name, password, role, birthday, class_id } = body;

    const check_email = await this.userRepository.findOneBy({
      email,
    });
    if (check_email) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Email đã tồn tại');

    let getClass: ClassEntity;
    if (class_id) {
      getClass = await this.classRepository.findOneBy({
        class_id,
        status: ClassStatus.ON,
      });
      if (!getClass) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp học không tồn tại');
    } else if (!class_id && role === UserRole.ADMIN) {
      getClass = null;
    } else if (!class_id && role === UserRole.USER) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp học không tồn tại');
    }

    const user = this.userRepository.create({
      address,
      avatar,
      birthday,
      email,
      first_name,
      gender,
      last_name,
      password,
      role,
      class: getClass,
    });
    await this.userRepository.save(user);
  }

  async updateUser(body: UpdateUserDto) {
    const { address, avatar, birthday, first_name, gender, last_name, phone, user_id, role } = body;

    const user = await this.userRepository.findOneBy({
      user_id,
    });

    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');

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
        role,
      },
    );
  }

  async deleteUser(body: DeleteUserDto) {
    const { user_id } = body;

    const user = await this.userRepository.findOneBy({
      user_id,
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');

    await this.userRepository.update(
      {
        user_id,
      },
      {
        status: UserStatus.BLOCK,
      },
    );
  }

  async getDetailUser(user_id: number) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');

    return new UserResponse(user);
  }

  async getListUser() {
    const userList = await this.userRepository.find({
      where: {
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
      },
      relations: {
        class: true,
      },
      order: {
        last_name: 'ASC',
      },
    });
    return LitUserResponse.mapToList(userList);
  }
}
