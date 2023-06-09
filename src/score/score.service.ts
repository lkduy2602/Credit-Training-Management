import { HttpStatus, Injectable } from '@nestjs/common';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreEntity } from './entities/score.entity';
import { Repository } from 'typeorm';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { PercentScore } from './enums/score.enum';
import { SubjectStatus } from 'src/subject/enums/subject.enum';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRole, UserStatus } from 'src/user/enums/user.enum';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,

    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllScoreInSubject(subject_id: number) {
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

    return userListInSubject.map((user) => {
      delete user.password;
      return {
        ...user,
        score: user.score[0],
      };
    });
  }

  async findOneScore(score_id: number) {
    const isExistScoreUser = await this.scoreRepository.findOneBy({
      score_id,
    });
    if (!isExistScoreUser) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Sinh viên không có trong môn này');

    return isExistScoreUser;
  }

  async updateScoreUser(body: UpdateScoreDto) {
    const { score_id } = body;
    let { attendance_score, midterm_score, final_score } = body;
    attendance_score = attendance_score ? attendance_score : 0;
    midterm_score = midterm_score ? midterm_score : 0;
    final_score = final_score ? final_score : 0;

    const isExistScoreUser = await this.scoreRepository.findOneBy({
      score_id,
    });
    if (!isExistScoreUser) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Sinh viên không có trong môn này');

    const totalScore = parseFloat(
      (
        attendance_score * PercentScore.PERCENT_OF_ATTENDANCE_SCORE +
        midterm_score * PercentScore.PERCENT_OF_MIDTERM_SCORE +
        final_score * PercentScore.PERCENT_OF_FINAL_SCORE
      ).toFixed(1),
    );

    const gpaScore = this.convertToGPA(totalScore);

    await this.scoreRepository.update(
      {
        score_id,
      },
      {
        attendance_score,
        midterm_score,
        final_score,
        total_score: totalScore,
        gpa_score: gpaScore,
      },
    );
  }

  async findAllScoreInUser(user_id: number) {
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

    return user_score;
  }

  async totalScoreInUser(user_id: number) {
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

    let total_score = 0;
    let total_score_gpa = 0;
    let total_credit = 0;
    let no_of_credit_pass = 0;
    user_score.forEach((score) => {
      total_score += score.total_score;
      total_score_gpa += score.gpa_score * score.subject.no_of_credit;
      total_credit += score.subject.no_of_credit;
      if (score.gpa_score >= 2) no_of_credit_pass += score.subject.no_of_credit;
    });

    return {
      total_score: Number((total_score / user_score.length).toFixed(1)),
      total_score_gpa: Number((total_score_gpa / total_credit).toFixed(1)),
      no_of_credit_pass,
    };
  }

  //====================================Support Function====================================

  convertToGPA(score: number) {
    if (score >= 9.0 && score <= 10.0) {
      return 4.0;
    } else if (score >= 8.5 && score <= 8.9) {
      return 3.7;
    } else if (score >= 8.0 && score <= 8.4) {
      return 3.5;
    } else if (score >= 7.0 && score <= 7.9) {
      return 3.0;
    } else if (score >= 6.5 && score <= 6.9) {
      return 2.7;
    } else if (score >= 5.5 && score <= 6.4) {
      return 2.3;
    } else if (score >= 5.0 && score <= 5.4) {
      return 2.0;
    } else if (score >= 4.0 && score <= 4.9) {
      return 1.5;
    } else {
      return 0.0;
    }
  }
}
