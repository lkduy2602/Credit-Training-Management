import { FullTextSearchEntity } from 'src/_utils/templates/full-text-search-entity.template';
import { removeVietnameseTones } from 'src/_utils/templates/remove-vietnamese-tones.template';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('semester')
export class SemesterEntity extends FullTextSearchEntity {
  @PrimaryGeneratedColumn('increment')
  semester_id: number;

  @Column()
  name: string;

  async createFullTextSearch() {
    super.createFullTextSearch(this.name);
  }
}
