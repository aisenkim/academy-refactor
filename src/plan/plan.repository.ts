import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { PlanDto } from './dto/plan.dto';
import { GetPlanDto } from './dto/get-plan.dto';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {
  async createPlan(plan: PlanDto, user: User) {
    const { testType, level, from, to, testDate, questionType } = plan;

    const planData = new Plan();
    planData.testType = testType;
    planData.level = level;
    planData.from = from;
    planData.to = to;
    planData.testDate = testDate;
    planData.questionType = questionType;

    await planData.save();
  }

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
