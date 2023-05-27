import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { CourseEntity } from 'src/course/entities/course.entity';
import { CourseStatus } from 'src/course/enums/course.enum';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './entities/department.entity';
import { DepartmentStatus } from './enums/department.enum';
import { ClassEntity } from 'src/class/entities/class.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async createDepartment(body: CreateDepartmentDto) {
    const { address, name, phone } = body;

    const isExistDepartment = await this.departmentRepository.findOneBy({
      full_text_search: removeVietnameseTones(name),
      status: DepartmentStatus.ON,
    });
    if (isExistDepartment) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');

    const save = this.departmentRepository.create({
      name,
      address,
      phone,
    });
    await this.departmentRepository.save(save);
  }

  async findAllDepartment() {
    let departmentList = await this.departmentRepository.find({
      where: {
        status: DepartmentStatus.ON,
      },
      order: {
        department_id: 'DESC',
      },
    });

    departmentList = await Promise.all(
      departmentList.map(async (department) => {
        const no_of_class = await this.classRepository.count({
          where: {
            department: {
              department_id: department.department_id,
            },
          },
        });

        return {
          ...department,
          no_of_class,
        };
      }) as any,
    );
    return departmentList;
  }

  async findOneDepartment(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const departmentDetail = await this.departmentRepository.findOneBy({
      department_id: id,
      status: DepartmentStatus.ON,
    });
    if (!departmentDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khoa không tồn tại');

    return departmentDetail;
  }

  async updateDepartment(body: UpdateDepartmentDto) {
    const { department_id, address, name, phone } = body;
    const departmentDetail = await this.departmentRepository.findOneBy({
      department_id,
      status: DepartmentStatus.ON,
    });
    if (!departmentDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khoa không tồn tại');

    if (departmentDetail.full_text_search != removeVietnameseTones(name)) {
      const isExistCourse = await this.departmentRepository.findOneBy({
        full_text_search: removeVietnameseTones(name),
        status: DepartmentStatus.ON,
      });
      if (isExistCourse) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');
    }

    const update = this.departmentRepository.create({
      ...departmentDetail,
      name,
    });
    await this.departmentRepository.save(update);
  }

  async removeDepartment(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const departmentDetail = await this.departmentRepository.findOneBy({
      department_id: id,
      status: DepartmentStatus.ON,
    });
    if (!departmentDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khoa không tồn tại');

    const update = this.departmentRepository.create({
      ...departmentDetail,
      status: DepartmentStatus.OFF,
    });
    await this.departmentRepository.save(update);
  }
}
