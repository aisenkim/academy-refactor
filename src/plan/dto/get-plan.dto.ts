import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPlanDto {
  @IsString()
  level: string;

  @IsString()
  testDate: string;

  @IsString()
  @IsOptional()
  testType: string;
}
