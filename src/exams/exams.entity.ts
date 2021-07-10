import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Exams extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string; // same as question id

  @Column()
  range: string; // sp3_1_5

  @Column({ type: 'date' })
  date: string;

  @Column()
  level: string;

  @Column()
  isPass: boolean; // indicates if a grade is a pass or fail

  // instead of this make a new table for retest
  // @Column()
  // isRetest: boolean; // indicates if current test is a retest or an initial test

  @Column()
  average: number;

  @Column()
  testType: string; // word || sentence

  // @OneToMany((_type) => ExamQuestion, (examQuestion) => examQuestion.exams, {
  //   eager: true,
  // })
  // examQuestion: ExamQuestion[];
  //
  // @ManyToOne((_type) => User, (user) => user.exams, { eager: false })
  // @Exclude({ toPlainOnly: true }) // whenever return json response, exlude user field (security reason)
  // user: User;
}

// connecting user with each answer data

// when querying, select by range and user
