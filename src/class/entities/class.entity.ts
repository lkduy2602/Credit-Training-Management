import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClassStatus } from '../enums/class.enum';
import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';

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
  //   department_id;
  //   course_id;
  //   training_system_id;

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
