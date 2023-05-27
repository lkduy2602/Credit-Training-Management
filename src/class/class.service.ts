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
import { CourseEntity } from 'src/course/entities/course.entity';
import { CourseStatus } from 'src/course/enums/course.enum';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { DepartmentStatus } from 'src/department/enums/department.enum';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,

    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async createClass(body: CreateClassDto) {
    const { name, course_id, department_id } = body;

    const isExistSubject = await this.classRepository.findOneBy({
      full_text_search: removeVietnameseTones(name),
      status: ClassStatus.ON,
    });
    if (isExistSubject) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');

    const courseDetail = await this.courseRepository.findOneBy({
      course_id: course_id,
      status: CourseStatus.ON,
    });
    if (!courseDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    const departmentDetail = await this.departmentRepository.findOneBy({
      department_id: department_id,
      status: DepartmentStatus.ON,
    });
    if (!departmentDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    const saveClass = this.classRepository.create({
      name: name,
      course: courseDetail,
      department: departmentDetail,
    });
    await this.classRepository.save(saveClass);
  }

  async getListClass() {
    let classList = await this.classRepository.find({
      where: {
        status: ClassStatus.ON,
      },
      relations: {
        department: true,
        course: true,
      },
    });

    classList = await Promise.all(
      classList.map(async (item) => {
        const no_of_student = await this.userRepository.count({
          where: {
            class: {
              class_id: item.class_id,
            },
          },
        });

        return {
          ...item,
          no_of_student,
        };
      }) as any,
    );
    return classList;
  }

  async findOneClass(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const subjectDetail = await this.classRepository.findOne({
      where: {
        class_id: id,
        status: ClassStatus.ON,
      },
      relations: {
        course: true,
        department: true,
      },
      order: {
        course: {
          name: 'DESC',
        },
      },
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    return subjectDetail;
  }

  async updateClass(body: UpdateClassDto) {
    const { class_id, name, course_id, department_id } = body;

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

    const courseDetail = await this.courseRepository.findOneBy({
      course_id: course_id,
      status: CourseStatus.ON,
    });
    if (!courseDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    const departmentDetail = await this.departmentRepository.findOneBy({
      department_id: department_id,
      status: DepartmentStatus.ON,
    });
    if (!departmentDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    const update = this.classRepository.create({
      ...classDetail,
      name,
      course: courseDetail,
      department: departmentDetail,
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
