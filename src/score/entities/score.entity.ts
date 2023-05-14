import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('score')
export class ScoreEntity {
  @PrimaryGeneratedColumn('increment')
  score_id: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  attendance_score: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  midterm_score: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  final_score: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  total_score: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  gpa_score: number;

  @ManyToOne(() => UserEntity, (user) => user.user_id)
  @JoinColumn({
    name: 'user_id'
  })
  user: UserEntity;

  @ManyToOne(() => SubjectEntity, (subject) => subject.subject_id)
  @JoinColumn({
    name: 'subject_id'
  })
  subject: SubjectEntity;
}
