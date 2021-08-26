import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { PlanService } from './plan.service';
import { GetPlanDto } from './dto/get-plan.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PlanDto } from './dto/plan.dto';

@Controller('plan')
@UseGuards(AuthGuard('jwt'))
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/createPlan')
  @Roles('admin')
  createPlan(@Body() plan: PlanDto) {
    return this.planService.createPlan(plan);
  }

  @Get('/getPlan')
  getPlan(@Query(ValidationPipe) getPlanDto: GetPlanDto) {
    return this.planService.getPlan(getPlanDto);
  }

  /**
   * Can't be called from outside
   * @param user
   * @returns
   */
  @Get()
  getPlanByUser(@GetUser() user: User) {
    return this.planService.getPlanByUser(user);
  }

  /**
   * delete plan belonging to user after test has been taken
   * @param user
   * @param id - id of plan to be deleted
   */
  @Delete('/:id')
  deletePlanByUser(@GetUser() user: User, @Param('id') id: number) {
    return this.planService.deletePlanById(user, id);
  }
}
