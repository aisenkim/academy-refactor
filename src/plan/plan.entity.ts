import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testType: string;

  @Column()
  level: string;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column()
  questionType: string; // word || meaning || mix

  @Column({ type: 'date' })
  testDate: string;

  @ManyToMany(() => User, (user) => user.plan, {})
  @JoinTable()
  @Exclude({ toPlainOnly: true }) // whenever return json response, exlude user field (security reason)
  user: User[];
}
