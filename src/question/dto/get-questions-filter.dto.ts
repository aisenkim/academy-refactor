import { IsNotEmpty } from 'class-validator';

export class GetQuestionsFilterDto {
  /**
   * level: user level
   * from: starting question number
   * to: end question number
   * testType: word || sentence || mixed
   */

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  from: number;

  @IsNotEmpty()
  to: number;

  // @IsNotEmpty()
  // testType: string;
}
