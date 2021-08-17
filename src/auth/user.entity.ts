import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exams } from '../exams/exams.entity';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';
import { Retest } from '../retests/retest.entity';
import { Plan } from '../plan/plan.entity';

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
  @OneToMany((_type) => Exams, (exams) => exams.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  exams: Exams[];

  @OneToMany((_type) => Retest, (retest) => retest.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  retest: Retest[];

  @ManyToMany(() => Plan, (plan) => plan.user, {})
  plan: Plan[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  roles: Role;
}
