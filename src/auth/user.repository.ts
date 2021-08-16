import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential-dto';
import { UserError } from './user-error.enum';
import { PGError } from '../util/pg-error.enum';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getAllUsers() {
    return await this.createQueryBuilder('user').getMany();
  }

  /**
   * save user to DB, otherwise return error message to service
   * @param authCredentialsDto - holds username, password, role
   * @return - UserError which is an enum
   */
  async createUser(authCredentialsDto: AuthCredentialDto): Promise<UserError> {
    const { username, password, name, level } = authCredentialsDto;
    let { roles } = authCredentialsDto;

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!this.isRoleType(roles)) {
      // if provided roles not part of the ROLES ENUM...
      roles = undefined; // database will set it to default value
    }

    const user = this.create({
      username,
      password: hashedPassword,
      name,
      level,
      roles,
    });
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
        console.log(err);
        return UserError.SERVER_ERROR;
      }
    }
  }

  /**
   * Check if provided role parameter === Role ENUM TYPE
   * @param test - role input entered by user
   * @returns - true if Role type. Otherwise false
   */
  isRoleType(test: any): test is Role {
    return Object.values(Role).indexOf(test) !== -1;
  }

  async deleteUser(username: string): Promise<void> {
    const result = await this.delete({ username });
    if (result.affected === 0) {
      throw new NotFoundException(`User with id: ${username} does not exist`);
    }
  }
}
