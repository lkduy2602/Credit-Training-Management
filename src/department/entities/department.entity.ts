import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DepartmentStatus } from '../enums/department.enum';
import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';

@Entity('department')
export class DepartmentEntity extends FullTextSearchEntity {
  @PrimaryGeneratedColumn('increment')
  department_id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({
    type: 'tinyint',
    default: DepartmentStatus.ON,
  })
  status: number;

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
