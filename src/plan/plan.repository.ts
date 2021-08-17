import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { PlanDto } from './dto/plan.dto';
import { GetPlanDto } from './dto/get-plan.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {
  async createPlan(plan: PlanDto, users: User[]): Promise<void> {
    const { testType, level, from, to, testDate, questionType } = plan;

    const planData = new Plan();
    planData.testType = testType;
    planData.level = level;
    planData.from = from;
    planData.to = to;
    planData.testDate = testDate;
    planData.questionType = questionType;
    planData.user = users;

    try {
      await planData.save();
    } catch (err) {
      if (
        err.code === '23502' ||
        err.code === '22P02' ||
        err.code === '22007'
      ) {
        throw new BadRequestException('Check form input data');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Find one plan that corresponds to level, testDate, and testType
   * @param getPlanDto
   */
  async getPlan(getPlanDto: GetPlanDto) {
    const { level, testDate } = getPlanDto;
    let testType: any = getPlanDto.testType;
    testType = testType.testType;
    const query = this.createQueryBuilder('plan');
    query
      .where('plan.level = :level', { level })
      .andWhere('plan.testDate = :testDate', { testDate })
      .andWhere('plan.testType = :testType', { testType });
    return await query.getOne();
  }
}
