import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartmentStatus } from '../enums/department.enum';
import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';
import { ClassEntity } from 'src/class/entities/class.entity';

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

  @OneToMany(() => ClassEntity, (c) => c.department)
  class: ClassEntity[];

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
