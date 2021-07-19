import { IsString } from 'class-validator';

export class PostSigninObjectDto {
  @IsString()
  accessToken: string;

  @IsString()
  name: string;

  @IsString()
  roles: string;

  @IsString()
  level: string;
}
