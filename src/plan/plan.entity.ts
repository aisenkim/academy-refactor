import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
