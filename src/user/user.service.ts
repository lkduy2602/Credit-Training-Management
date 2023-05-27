import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { ClassEntity } from 'src/class/entities/class.entity';
import { ClassStatus } from 'src/class/enums/class.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole, UserStatus } from './enums/user.enum';
import { LitUserResponse } from './responses/list-user.reponse';
import { UserResponse } from './responses/user.reponse';
import { hashPassword } from 'src/_utils/templates/hash-password.template';

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
    }
    if (role === UserRole.ADMIN) {
      getClass = null;
    }
    if (!class_id && role === UserRole.USER) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Vui lòng chọn lớp');
    }

    const hash = await hashPassword(password);

    const user = this.userRepository.create({
      address,
      avatar,
      birthday,
      email,
      first_name,
      gender,
      last_name,
      password: hash,
      role,
      class: getClass,
    });
    await this.userRepository.save(user);
  }

  async updateUser(body: UpdateUserDto) {
    const { address, avatar, birthday, first_name, gender, last_name, phone, user_id, role, class_id } = body;

    const [user, getClass] = await Promise.all([
      this.userRepository.findOneBy({
        user_id,
      }),
      this.classRepository.findOneBy({
        class_id,
      }),
    ]);

    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');
    if (!getClass) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp không tồn tại');

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
        class: getClass,
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
    if (!user_id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'user_id không được để trống');

    const user = await this.userRepository.findOne({
      where: {
        user_id,
      },
      relations: {
        class: true,
      },
    });
    if (!user) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'User không tồn tại');

    return new UserResponse(user);
  }

  async getListUser() {
    const userList = await this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.USER })
      .leftJoinAndSelect('user.class', 'class')
      .orderBy(`substring_index(last_name, ' ', -1)`)
      .getMany();
    return LitUserResponse.mapToList(userList);
  }

  async generateUserIfEmpty() {
    const isEmptyUser = (await this.userRepository.find()).length == 0;
    if (!isEmptyUser) return;

    const user = {
      email: 'lkduy2602@gmail.com',
      password: 'duympt123',
      first_name: 'Lê',
      last_name: 'Khánh Duy',
      birthday: '2000-02-26',
      gender: 1,
      role: UserRole.ADMIN,
    };

    const hash = await hashPassword(user.password);

    const save = this.userRepository.create({
      ...user,
      password: hash,
    });
    await this.userRepository.save(save);
  }
}
