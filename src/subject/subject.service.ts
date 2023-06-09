import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { ScoreEntity } from 'src/score/entities/score.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRole, UserStatus } from 'src/user/enums/user.enum';
import { LitUserResponse } from 'src/user/responses/list-user.reponse';
import { Repository } from 'typeorm';
import { AddUserSubjectDto } from './dto/add-user-subject.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { DeleteSubjectDto } from './dto/delete-subject.dto';
import { DeleteUserSubjectDto } from './dto/delete-user-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectEntity } from './entities/subject.entity';
import { SubjectStatus } from './enums/subject.enum';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,

    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createSubject(body: CreateSubjectDto) {
    const { name, no_of_credit } = body;

    const isExistSubject = await this.subjectRepository.findOneBy({
      full_text_search: removeVietnameseTones(name),
      status: SubjectStatus.ACTIVE,
    });
    if (isExistSubject) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');

    const subject = this.subjectRepository.create({
      name,
      no_of_credit,
    });
    await this.subjectRepository.save(subject);
  }

  async findAllSubject() {
    const subjectList = await this.subjectRepository.find({
      where: {
        status: SubjectStatus.ACTIVE,
      },
      order: {
        subject_id: 'DESC',
      },
      relations: {
        score: true,
      },
    });

    const response = subjectList.map((item) => {
      return {
        ...item,
        score: [],
        no_of_user: item.score.length,
      };
    });

    return response;
  }

  async findOneSubject(id: number) {
    if (!id) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'id không tồn tại');

    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id: id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    return subjectDetail;
  }

  async updateSubject(body: UpdateSubjectDto) {
    const { subject_id, name, no_of_credit } = body;
    const subjectDetail = await this.subjectRepository.findOne({
      where: {
        subject_id,
        status: SubjectStatus.ACTIVE,
      },
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    if (subjectDetail.full_text_search != removeVietnameseTones(name)) {
      const isExistSubject = await this.subjectRepository.findOneBy({
        full_text_search: removeVietnameseTones(name),
        status: SubjectStatus.ACTIVE,
      });
      if (isExistSubject) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tên đã tồn tại');
    }

    const update = this.subjectRepository.create({
      ...subjectDetail,
      name,
      no_of_credit,
    });
    await this.subjectRepository.save(update);
  }

  async removeSubject(body: DeleteSubjectDto) {
    const { subject_id } = body;

    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    const update = this.subjectRepository.create({
      ...subjectDetail,
      status: SubjectStatus.BLOCK,
    });
    await this.subjectRepository.save(update);
  }

  async addUserSubject(body: AddUserSubjectDto) {
    const { subject_id, user_ids } = body;

    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    await Promise.all(
      user_ids.map(async (item) => {
        const user = await this.userRepository.findOneBy({
          user_id: item,
          status: UserStatus.ACTIVE,
          role: UserRole.USER,
        });
        if (!user) return;

        const isExistUserInSubject = await this.scoreRepository.findOneBy({
          user: {
            user_id: item,
          },
          subject: {
            subject_id,
          },
        });
        if (isExistUserInSubject) return;

        const addUserToSubject = this.scoreRepository.create({
          user,
          subject: subjectDetail,
        });
        await this.scoreRepository.save(addUserToSubject);
      }),
    );
  }

  async deleteUserSubject(body: DeleteUserSubjectDto) {
    const { subject_id, user_ids } = body;

    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    await Promise.all(
      user_ids.map(async (item) => {
        const user = await this.userRepository.findOneBy({
          user_id: item,
          status: UserStatus.ACTIVE,
          role: UserRole.USER,
        });
        if (!user) return;

        const isExistUserInSubject = await this.scoreRepository.findOneBy({
          user: {
            user_id: item,
          },
          subject: {
            subject_id,
          },
        });
        if (!isExistUserInSubject) return;

        await this.scoreRepository.delete({
          user: {
            user_id: item,
          },
          subject: {
            subject_id,
          },
        });
      }),
    );
  }

  async findAllUserInSubject(subject_id: number) {
    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    const userListInSubject = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.class', 'class')
      .leftJoinAndSelect('user.score', 'score')
      .leftJoinAndSelect('score.subject', 'subject')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.USER })
      .andWhere('subject.subject_id = :subject_id', {
        subject_id,
      })
      .orderBy(`substring_index(last_name, ' ', -1)`)
      .getMany();

    return LitUserResponse.mapToList(userListInSubject);
  }

  async findAllUserNotInSubject(subject_id: number) {
    const subjectDetail = await this.subjectRepository.findOneBy({
      subject_id,
      status: SubjectStatus.ACTIVE,
    });
    if (!subjectDetail) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Môn học không tồn tại');

    const userListInSubject = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.score', 'score')
      .leftJoinAndSelect('score.subject', 'subject')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.USER })
      .andWhere('subject.subject_id = :subject_id', {
        subject_id,
      })
      .orderBy(`substring_index(last_name, ' ', -1)`)
      .getMany();
    const userIdListInSubject = userListInSubject.map((user) => user.user_id);

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.class', 'class')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.role = :role', { role: UserRole.USER });

    if (userIdListInSubject.length > 0) {
      queryBuilder.andWhere('user.user_id NOT IN (:...user_ids)', { user_ids: userIdListInSubject });
    }

    const userListNotInSubject = await queryBuilder.orderBy(`(substring_index(last_name, ' ', -1))`).getMany();

    return LitUserResponse.mapToList(userListNotInSubject);
  }

  async findAllSubjectUserRegister(user_id: number) {
    const subject_user_register = await this.subjectRepository.find({
      where: {
        score: {
          user: {
            user_id,
          },
        },
        status: SubjectStatus.ACTIVE,
      },
      order: {
        subject_id: 'DESC',
      },
    });

    return subject_user_register;
  }

  async deleteSubjectUserRegister(user_id: number, subject_id: number) {
    const user = await this.userRepository.findOneBy({
      user_id: user_id,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    });
    if (!user) return;

    const isExistUserInSubject = await this.scoreRepository.findOneBy({
      user: {
        user_id: user_id,
      },
      subject: {
        subject_id,
      },
    });
    if (!isExistUserInSubject) return;

    await this.scoreRepository.delete({
      user: {
        user_id: user_id,
      },
      subject: {
        subject_id,
      },
    });
  }
}
