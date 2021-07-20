import { IsString } from 'class-validator';

export class GetUserScoreDto {
  @IsString()
  username: string;

  // @IsString()
  // date: string;
}
