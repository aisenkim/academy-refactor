import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { AuthService } from './auth.service';
import { SigninCredentialDto } from './dto/signin-credential.dto';

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
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signinCredentialDto);
  }
}
