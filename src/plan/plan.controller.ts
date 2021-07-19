import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { PlanService } from './plan.service';
import { GetPlanDto } from './dto/get-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/createPlan')
  @Roles('admin')
  createPlan(@Body() plan, @GetUser() user: User) {
    return this.planService.createPlan(plan, user);
  }

  @Get('/getPlan')
  getPlan(@Query(ValidationPipe) getPlanDto: GetPlanDto) {
    return this.planService.getPlan(getPlanDto);
  }
}
