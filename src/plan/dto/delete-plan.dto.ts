import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeletePlanDto {
  @IsString()
  level: string;

  @IsString()
  testType: string; // word || sentence

  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;
}
