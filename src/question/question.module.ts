import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsRepository } from './questions.repository';
import { PlanRepository } from '../plan/plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionsRepository, PlanRepository])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
