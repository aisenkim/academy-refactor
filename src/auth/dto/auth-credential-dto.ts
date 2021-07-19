import { Role } from '../role.enum';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  name: string;

  @IsString()
  level: string;

  @IsString()
  @IsOptional()
  roles: Role;
}
