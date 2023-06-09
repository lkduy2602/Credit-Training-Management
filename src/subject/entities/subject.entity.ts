import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';
import { ScoreEntity } from 'src/score/entities/score.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectStatus } from '../enums/subject.enum';

@Entity('subject')
export class SubjectEntity extends FullTextSearchEntity {
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

  @OneToMany(() => ScoreEntity, (score) => score.subject)
  score: ScoreEntity[];

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
