import { Module } from '@nestjs/common';
import { RetestsController } from './retests.controller';
import { RetestsService } from './retests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetestRepository } from './retest.repository';
import { QuestionModule } from '../question/question.module';
import { SentenceModule } from '../sentence/sentence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RetestRepository]),
    QuestionModule,
    SentenceModule,
  ],
  controllers: [RetestsController],
  providers: [RetestsService],
})
export class RetestsModule {}
