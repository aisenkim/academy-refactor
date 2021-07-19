import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exams } from '../exams/exams.entity';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';

@Entity()
// @Unique()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column()
  level: string;

  // // eager:true -> it will automatically fetch exams
  @OneToMany((_type) => Exams, (exams) => exams.user, { eager: true })
  exams: Exams[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  roles: Role;
}
