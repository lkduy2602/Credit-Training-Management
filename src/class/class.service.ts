import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassEntity } from './entities/class.entity';
import { ClassStatus } from './enums/class.enum';
import { UserRole, UserStatus } from 'src/user/enums/user.enum';
import { LitUserResponse } from 'src/user/responses/list-user.reponse';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createClass(body: CreateClassDto) {
    const { name } = body;

    const isExistSubject = await this.classRepository.findOneBy({
      full_text_search: removeVietnameseTones(name),
      status: ClassStatus.ON,
    });
    if (isExistSubject) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');

    const saveClass = this.classRepository.create({
      name: name,
    });
    await this.classRepository.save(saveClass);
  }

  async getListClass() {
    const classList = await this.classRepository.find({
      where: {
        status: ClassStatus.ON,
      },
    });
    return classList;
  }

  async findOneClass(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const subjectDetail = await this.classRepository.findOneBy({
      class_id: id,
      status: ClassStatus.ON,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    return subjectDetail;
  }

  async updateClass(body: UpdateClassDto) {
    const { class_id, name } = body;

    const classDetail = await this.classRepository.findOne({
      where: {
        class_id,
        status: ClassStatus.ON,
      },
    });
    if (!classDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp học không tồn tại');

    if (classDetail.full_text_search != removeVietnameseTones(name)) {
      const isExistClass = await this.classRepository.findOneBy({
        full_text_search: removeVietnameseTones(name),
        status: ClassStatus.ON,
      });
      if (isExistClass) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');
    }

    const update = this.classRepository.create({
      ...classDetail,
      name,
    });
    await this.classRepository.save(update);
  }

  async deleteClass(body: DeleteClassDto) {
    const { class_id } = body;

    const classDetail = await this.classRepository.findOneBy({
      class_id,
      status: ClassStatus.ON,
    });
    if (!classDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp học không tồn tại');

    const update = this.classRepository.create({
      ...classDetail,
      status: ClassStatus.OFF,
    });
    await this.classRepository.save(update);
  }

  async findAllUserInClass(class_id: number) {
    if (!class_id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'class_id không tồn tại');

    const classDetail = await this.classRepository.findOneBy({
      class_id,
      status: ClassStatus.ON,
    });
    if (!classDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Lớp học không tồn tại');

    const userListInSubject = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.class', 'class')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.USER })
      .andWhere('user.class_id = :class_id', {
        class_id,
      })
      .orderBy(`substring_index(last_name, ' ', -1)`)
      .getMany();

    return LitUserResponse.mapToList(userListInSubject);
  }
}
