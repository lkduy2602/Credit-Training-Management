import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CourseStatus } from '../enums/course.enum';
import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';

@Entity('course')
export class CourseEntity extends FullTextSearchEntity  {
  @PrimaryGeneratedColumn('increment')
  course_id: number;

  @Column()
  name: string;

  @Column({
    type: 'tinyint',
    default: CourseStatus.ON,
  })
  status: number;

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
