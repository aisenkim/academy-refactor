import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Question extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  level: string;

  @Column()
  question_num: number;

  @Column()
  question: string;

  @Column()
  answer: string;
}
