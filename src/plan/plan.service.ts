import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanRepository } from './plan.repository';
import { User } from '../auth/user.entity';
import { GetPlanDto } from './dto/get-plan.dto';
import { PlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanRepository) private planRepository: PlanRepository,
  ) {}

  async createPlan(plan: PlanDto, user: User) {
    return await this.planRepository.createPlan(plan, user);
  }

  async getPlan(getPlanDto: GetPlanDto) {
    return await this.planRepository.getPlan(getPlanDto);
  }
}
