import { IsDate, IsNumber, IsString } from 'class-validator';

export class PlanDto {
  @IsString()
  testType: string;

  @IsString()
  level: string;

  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsString()
  questionType: string;

  @IsString()
  testDate: string;
}
