import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserGender, UserRole, UserStatus } from '../enums/user.enum';
import { ClassEntity } from 'src/class/entities/class.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  birthday: string;

  @Column({
    type: 'tinyint',
    default: UserGender.FEMALE,
  })
  gender: UserGender;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'tinyint',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToOne(() => ClassEntity, (c) => c.class_id, {
    nullable: true,
  })
  @JoinColumn({
    name: 'class_id',
  })
  class: ClassEntity;
}
