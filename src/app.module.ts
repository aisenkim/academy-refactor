import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './question/question.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
