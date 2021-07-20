import { Injectable } from '@nestjs/common';
import { RetestRepository } from './retest.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class RetestsService {
  constructor(
    @InjectRepository(RetestRepository)
    private retestRepository: RetestRepository,
  ) {}

  /**
   * look through current user's one to many relationship between Retest table
   */
  getRetests(user: User) {
    return this.retestRepository.getRetests(user);
  }
}
