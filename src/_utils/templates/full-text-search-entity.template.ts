import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { removeVietnameseTones } from './remove-vietnamese-tones.template';

export class FullTextSearchEntity {
  @Column()
  full_text_search: string;

  @BeforeInsert()
  @BeforeUpdate()
  async createFullTextSearch(value: string) {
    this.full_text_search = removeVietnameseTones(value);
  }
}
