import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { ClassEntity } from 'src/class/entities/class.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';
import { CourseStatus } from './enums/course.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async createCourse(body: CreateCourseDto) {
    const { name } = body;

    const isExistCourse = await this.courseRepository.findOneBy({
      full_text_search: removeVietnameseTones(name),
      status: CourseStatus.ON,
    });
    if (isExistCourse) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');

    const saveClass = this.courseRepository.create({
      name: name,
    });
    await this.courseRepository.save(saveClass);
  }

  async findAllCourse() {
    let courseList = await this.courseRepository.find({
      where: {
        status: CourseStatus.ON,
      },
      order: {
        name: 'DESC',
      },
    });

    courseList = await Promise.all(
      courseList.map(async (course) => {
        const no_of_class = await this.classRepository.count({
          where: {
            course: {
              course_id: course.course_id,
            },
          },
        });

        return {
          ...course,
          no_of_class,
        };
      }) as any,
    );

    return courseList;
  }

  async findOneCourse(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const courseDetail = await this.courseRepository.findOneBy({
      course_id: id,
      status: CourseStatus.ON,
    });
    if (!courseDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    return courseDetail;
  }

  async updateCourse(body: UpdateCourseDto) {
    const { course_id, name } = body;

    const courseDetail = await this.courseRepository.findOne({
      where: {
        course_id,
        status: CourseStatus.ON,
      },
    });
    if (!courseDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    if (courseDetail.full_text_search != removeVietnameseTones(name)) {
      const isExistCourse = await this.courseRepository.findOneBy({
        full_text_search: removeVietnameseTones(name),
        status: CourseStatus.ON,
      });
      if (isExistCourse) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');
    }

    const update = this.courseRepository.create({
      ...courseDetail,
      name,
    });
    await this.courseRepository.save(update);
  }

  async removeCourse(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const courseDetail = await this.courseRepository.findOneBy({
      course_id: id,
      status: CourseStatus.ON,
    });
    if (!courseDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Khóa học không tồn tại');

    const update = this.courseRepository.create({
      ...courseDetail,
      status: CourseStatus.OFF,
    });
    await this.courseRepository.save(update);
  }
}
