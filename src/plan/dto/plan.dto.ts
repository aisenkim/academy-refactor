import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PlanDto {
  @IsString()
  @IsNotEmpty()
  testType: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  from: number;

  @IsNotEmpty()
  to: number;

  @IsString()
  @IsNotEmpty()
  questionType: string;

  @IsString()
  @IsNotEmpty()
  testDate: string;
}
