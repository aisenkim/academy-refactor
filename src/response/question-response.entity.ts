import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exams } from '../exams/exams.entity';

/**
 * Entity to each response of a question
 */
@Entity()
export class QuestionResponse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string; // same as question id

  @Column()
  question_num: number;

  @Column()
  answer: string; // answer typed by user

  @Column()
  isCorrect: boolean;

  @Column()
  isMeaning: boolean; // if question type is word or meaning

  @ManyToOne((_type) => Exams, (exams) => exams.examQuestion, {
    eager: false,
    onDelete: 'CASCADE',
  })
  exams: Exams;
}
