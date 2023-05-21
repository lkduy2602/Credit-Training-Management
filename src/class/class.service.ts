import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { Repository } from 'typeorm';
import { ClassStatus } from './enums/class.enum';
import { CreateClassDto } from './dto/create-class.dto';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { UpdateClassDto } from './dto/update-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';
import { AddUserClassDto } from './dto/add-user-class.dto';
import { UserRole, UserStatus } from 'src/user/enums/user.enum';
import { UserEntity } from 'src/user/entities/user.entity';

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
}
