import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CourseStatus } from '../enums/course.enum';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn('increment')
  course_id: number;

  @Column()
  name: string;

  @Column({
    type: 'tinyint',
    default: CourseStatus.ON,
  })
  status: number;
}
