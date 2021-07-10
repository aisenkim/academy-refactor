import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UserError } from './user-error.enum';
import { PGError } from '../util/pg-error.enum';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  /**
   * save user to DB, otherwise return error message to service
   * @param authCredentialsDto - holds username, password, role
   * @return - UserError which is an enum
   */
  async createUser(authCredentialsDto: AuthCredentialDto): Promise<UserError> {
    const { username, password } = authCredentialsDto;

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
      // return nothing for no errors
      return;
    } catch (err) {
      // catch for duplicate username thrown by Postgres
      // Postgres error code [23505] -> unique_violation
      if (err.code === PGError.UNIQUE_VIOLATION) {
        return UserError.DUPLICATE_USER;
      } else {
        return UserError.SERVER_ERROR;
      }
    }
  }
}
