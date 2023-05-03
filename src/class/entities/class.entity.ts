import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClassStatus } from '../enums/class.enum';

@Entity('class')
export class ClassEntity {
  @PrimaryGeneratedColumn('increment')
  class_id: number;

  @Column()
  name: string;

  @Column({
    default: ClassStatus.ON,
  })
  status: ClassStatus;
  //   department_id;
  //   course_id;
  //   training_system_id;
}
