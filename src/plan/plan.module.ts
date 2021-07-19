import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanRepository } from './plan.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlanRepository]), AuthModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
