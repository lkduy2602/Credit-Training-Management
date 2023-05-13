import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectStatus } from '../enums/subject.enum';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';

@Entity('subject')
export class SubjectEntity {
  @PrimaryGeneratedColumn('increment')
  subject_id: number;

  @Column()
  name: string;

  @Column({
    type: 'tinyint',
    default: SubjectStatus.ACTIVE,
  })
  status: SubjectStatus;

  @Column()
  no_of_credit: number;

  @Column({
    default: ''
  })
  full_text_search: string;

  @BeforeInsert()
  @BeforeUpdate()
  async createFullTextSearch() {
    this.full_text_search = removeVietnameseTones(this.name);
  }
}
