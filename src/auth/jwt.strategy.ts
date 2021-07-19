import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    // since extending Passport Strategy, need to call the super method
    super({
      secretOrKey: 'topSecret15',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // how to extract token
    });
  }

  /**
   * This function is only called when token has been verified (correct key used)
   * and not expired
   * At this point, know that payload is valid and return a user
   * @param payload
   * @return - authorized user || Unauthorized Exception if not found
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
