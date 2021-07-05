import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './question/question.module';
import { typeOrmConfig } from './config/typeorm.config';
import { SentenceModule } from './sentence/sentence.module';

@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(typeOrmConfig), SentenceModule],
})
export class AppModule {}
