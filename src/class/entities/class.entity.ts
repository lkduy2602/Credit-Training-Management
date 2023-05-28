import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassStatus } from '../enums/class.enum';
import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';
import { CourseEntity } from 'src/course/entities/course.entity';
import { DepartmentEntity } from 'src/department/entities/department.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('class')
export class ClassEntity extends FullTextSearchEntity {
  @PrimaryGeneratedColumn('increment')
  class_id: number;

  @Column()
  name: string;

  @Column({
    default: ClassStatus.ON,
  })
  status: ClassStatus;

  @ManyToOne(() => DepartmentEntity, (department) => department.department_id)
  @JoinColumn({
    name: 'department_id',
  })
  department: DepartmentEntity;

  @ManyToOne(() => CourseEntity, (course) => course.course_id)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;

  @OneToMany(() => UserEntity, (user) => user.class)
  user: UserEntity[];


  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
