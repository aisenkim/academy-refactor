import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { AuthService } from './auth.service';
import { SigninCredentialDto } from './dto/signin-credential.dto';
import { PostSigninObjectDto } from './dto/post-signin-object.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() signinCredentialDto: SigninCredentialDto,
  ): Promise<PostSigninObjectDto> {
    return this.authService.signIn(signinCredentialDto);
  }

  @Delete('/users/:username')
  deleteUser(@Param('username') username: string): Promise<void> {
    return this.authService.deleteUser(username);
  }

  /**
   * Query all users
   */
  @Get('/users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }
}
