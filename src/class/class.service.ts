import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { Repository } from 'typeorm';
import { ClassStatus } from './enums/class.enum';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}
  async getListClass() {
    const classList = await this.classRepository.find({
      where: {
        status: ClassStatus.ON,
      },
    });
    return classList;
  }
}
