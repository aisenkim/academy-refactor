import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanRepository } from './plan.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from '../auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanRepository, UsersRepository]),
    AuthModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
