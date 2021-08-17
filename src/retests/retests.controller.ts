import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { RetestsService } from './retests.service';

@Controller('retests')
@UseGuards(AuthGuard('jwt'))
export class RetestsController {
  constructor(private readonly retestService: RetestsService) {}

  /**
   * Getting retest plan
   */
  @Get()
  getRetests(@GetUser() user: User) {
    return this.retestService.getRetests(user);
  }

  /**
   * Get retest questions
   */
  @Get('/questions')
  getRetestsQuestions(@Query('range') range, @Query('testType') testType) {
    return this.retestService.getRetestsQuestions(range, testType);
  }
}
