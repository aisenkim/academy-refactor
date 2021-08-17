import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionResponseRepository } from './question-response.repository';
import { SentenceResponseRepository } from './sentence-response.repository';
import { ExamRepository } from '../exams/exam.repository';
import { RetestRepository } from '../retests/retest.repository';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionResponseRepository,
      SentenceResponseRepository,
      ExamRepository,
      RetestRepository,
    ]),
    PlanModule, // for deleting plan from user
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
