import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './question/question.module';
import { typeOrmConfig } from './config/typeorm.config';
import { SentenceModule } from './sentence/sentence.module';
import { AuthModule } from './auth/auth.module';
import { ResponseModule } from './response/response.module';
import { ExamsModule } from './exams/exams.module';
import { RetestsModule } from './retests/retests.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    QuestionModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    SentenceModule,
    AuthModule,
    ResponseModule,
    ExamsModule,
    RetestsModule,
    PlanModule,
  ],
})
export class AppModule {}
