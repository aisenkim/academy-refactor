import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { UserError } from './user-error.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SigninCredentialDto } from './dto/signin-credential.dto';
import { PostSigninObjectDto } from './dto/post-signin-object.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.getAllUsers();
  }

  /**
   * Signup user
   * handle error by receiving error message from the repository
   * @param authCredentialsDto - holds username and password
   */
  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const userError = await this.usersRepository.createUser(authCredentialsDto);
    if (!userError) {
      // no errors
      return;
    }
    if (userError === UserError.DUPLICATE_USER) {
      throw new ConflictException(UserError.DUPLICATE_USER);
    } else {
      throw new InternalServerErrorException();
    }
  }

  async signIn(
    signinCredentialDto: SigninCredentialDto,
  ): Promise<PostSigninObjectDto> {
    const { username, password } = signinCredentialDto;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return {
        accessToken,
        name: user.name,
        roles: user.roles,
        level: user.level,
      };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async deleteUser(username: string) {
    return await this.usersRepository.deleteUser(username);
  }
}
