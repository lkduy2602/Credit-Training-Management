import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { Repository } from 'typeorm';
import { SubjectStatus } from 'src/subject/enums/subject.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus, UserRole } from 'src/user/enums/user.enum';
import { ClassEntity } from 'src/class/entities/class.entity';
import { ClassStatus } from 'src/class/enums/class.enum';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { ScoreEntity } from 'src/score/entities/score.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,

    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,
  ) {}

  async getNoOfAll() {
    const no_of_student = await this.userRepository.count({
      where: {
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
      },
    });

    const no_of_subject = await this.subjectRepository.count({
      where: {
        status: SubjectStatus.ACTIVE,
      },
    });

    const no_of_class = await this.classRepository.count({
      where: {
        status: ClassStatus.ON,
      },
    });

    return {
      no_of_student,
      no_of_subject,
      no_of_class,
    };
  }

  async getNoOfStudentsRegisteredForSubject() {
    let subjectList = await this.subjectRepository.find({
      where: {
        status: SubjectStatus.ACTIVE,
      },
      order: {
        subject_id: 'DESC',
      },
      relations: {
        score: {
          user: true,
        },
      },
    });

    subjectList = subjectList.map((item) => {
      return {
        name: item.name,
        quantity: item.score.length,
      };
    }) as any;

    return subjectList;
  }

  async getNoOfStudentsRegisteredByDepartment() {
    try {
      const result = await this.departmentRepository.find({
        where: {
          class: {
            status: ClassStatus.ON,
            user: {
              status: UserStatus.ACTIVE,
            },
          },
        },
        relations: {
          class: {
            user: true,
          },
        },
      });

      const noOfStudentDepartment = result.map((item) => {
        const noOfStudent = item.class.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.user.length;
        }, 0);

        return {
          name: item.name,
          no_of_student: noOfStudent,
        };
      });

      return noOfStudentDepartment;
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  async getPassFailCreditByUser(user_id: number) {
    const user_score = await this.scoreRepository.find({
      where: {
        user: {
          user_id: user_id,
        },
      },
      relations: {
        subject: true,
      },
    });

    let no_of_pass = 0;
    let no_of_fail = 0;
    user_score.forEach((score) => {
      if (score.gpa_score || score.gpa_score == 0) {
        if (score.gpa_score < 2) {
          no_of_fail += 1;
        } else {
          no_of_pass += 1;
        }
      }
    });

    return [
      {
        result: 'Đạt',
        no_of: no_of_pass,
      },
      {
        result: 'X',
        no_of: no_of_fail,
      },
    ];
  }
}
