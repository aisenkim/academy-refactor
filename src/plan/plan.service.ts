import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanRepository } from './plan.repository';
import { GetPlanDto } from './dto/get-plan.dto';
import { PlanDto } from './dto/plan.dto';
import { UsersRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';
import { Plan } from './plan.entity';
import { DeletePlanDto } from './dto/delete-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanRepository) private planRepository: PlanRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async createPlan(plan: PlanDto) {
    const level: string = plan.level;
    const allUsers = await this.userRepository.getAllUsers();
    // get users of the plan's level
    const levelFilteredUsers = allUsers.filter((user) => user.level === level);
    return await this.planRepository.createPlan(plan, levelFilteredUsers);
  }

  async getPlan(getPlanDto: GetPlanDto) {
    return await this.planRepository.getPlan(getPlanDto);
  }

  /**
   * Get all plans belonging to the current logged in user
   * Using Many to Many relation
   * [NOTE] - Plan is inserted to all users with the level of plan being created
   */
  async getPlanByUser(user: User) {
    // get User table and Plan table joined
    const userJoinedByPlan: User = await this.userRepository.findOne({
      relations: ['plan'],
      where: { username: user.username },
    });
    return userJoinedByPlan.plan;
  }

  /**
   * Used in response.service.ts to delete plan after responses have been submitted
   * @param user
   * @param deletePlanDto
   */
  async deletePlanByUser(user: User, deletePlanDto: DeletePlanDto) {
    // 1. get user to delete a plan that is completed
    const userJoinedByPlan: User = await this.userRepository.findOne({
      relations: ['plan'],
      where: { username: user.username },
    });
    const planToDelete = userJoinedByPlan.plan.find(
      (userPlan) =>
        userPlan.level === deletePlanDto.level &&
        userPlan.from === deletePlanDto.from &&
        userPlan.to === deletePlanDto.to &&
        userPlan.testType === deletePlanDto.testType,
    );
    // 2. delete plan from the user
    userJoinedByPlan.plan = userJoinedByPlan.plan.filter(
      (userPlan) => userPlan.id !== planToDelete.id,
    );
    // 3. save the user
    await this.userRepository.save(userJoinedByPlan);
  }

  /**
   * Used by the controller
   * @param user - current logged in user
   * @param id - plan id
   */
  async deletePlanById(user: User, id: number) {
    // 1. get user to delete a plan that is completed
    const userJoinedByPlan: User = await this.userRepository.findOne({
      relations: ['plan'],
      where: { username: user.username },
    });
    // 2. delete plan from the user
    userJoinedByPlan.plan = userJoinedByPlan.plan.filter((userPlan) => {
      return userPlan.id !== id;
    });
    // 3. save the user
    await this.userRepository.save(userJoinedByPlan);
  }
}
