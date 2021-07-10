import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
// @Unique()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  level: string;

  // // eager:true -> it will automatically fetch exams
  // @OneToMany((_type) => Exam, (exams) => exams.user, { eager: true })
  // exams: Exam[];
  //
  // @Column({ type: 'enum', enum: Role, default: Role.USER })
  // roles: Role;
}
