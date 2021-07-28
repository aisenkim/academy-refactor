import { IsNotEmpty } from 'class-validator';
import { User } from '../../auth/user.entity';

export class RetestDto {
  @IsNotEmpty()
  isComplete: boolean;

  @IsNotEmpty()
  range: string;

  @IsNotEmpty()
  testDate: string;

  @IsNotEmpty()
  testType: string;

  @IsNotEmpty()
  questionType: string;

  user: User;
}
