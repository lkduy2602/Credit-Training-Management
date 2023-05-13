import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { ILike, Like, Repository } from 'typeorm';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { ExceptionResponse } from 'src/_utils/exceptions/error-response.exception';
import { SubjectStatus } from './enums/subject.enum';
import { DeleteSubjectDto } from './dto/delete-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
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
    });

    return subjectList;
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
}
