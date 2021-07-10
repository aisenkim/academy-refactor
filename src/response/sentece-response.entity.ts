import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity to each response of a sentence-question
 */
@Entity()
export class SentenceResponse extends BaseEntity {
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

  // TODO - implement connection after defining [USER] and [EXAMS]
  // @ManyToOne((_type) => Exam, (exams) => exams.examQuestion, { eager: false })
  // exams: Exam;
}
