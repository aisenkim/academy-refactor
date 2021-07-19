import { IsNotEmpty } from 'class-validator';

export class ResponseDto {
  @IsNotEmpty()
  question_num: number[];

  @IsNotEmpty()
  questions: string[];

  @IsNotEmpty()
  range: string;

  @IsNotEmpty()
  answer: string[];

  @IsNotEmpty()
  myAnswers: string[];

  @IsNotEmpty()
  isMeaning: boolean[];

  @IsNotEmpty()
  testType: string; // word || sentence
}
