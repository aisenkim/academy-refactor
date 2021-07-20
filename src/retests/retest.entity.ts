import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

/**
 * Establish relationship between user to keep track of retest for a specific user
 * Delete the retest after a user completes the retest
 */
@Entity()
export class Retest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  // Did user pass the retest
  @Column()
  isComplete: boolean;

  @Column()
  range: string; // level_start#_end#

  @Column({ type: 'date' })
  testDate: string; // the date retest was assigned

  @Column()
  testType: string; // word || sentence

  @ManyToOne((_type) => User, (user) => user.retest, { eager: false })
  @Exclude({ toPlainOnly: true }) // whenever return json response, exclude user field (security reason)
  user: User;
}
