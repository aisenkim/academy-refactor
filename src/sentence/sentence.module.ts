import { Module } from '@nestjs/common';
import { SentenceController } from './sentence.controller';
import { SentenceService } from './sentence.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceRepository } from './sentence.repository';
import { PlanRepository } from '../plan/plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SentenceRepository, PlanRepository])],
  controllers: [SentenceController],
  providers: [SentenceService],
})
export class SentenceModule {}
