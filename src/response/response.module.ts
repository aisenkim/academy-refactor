import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionResponseRepository } from './question-response.repository';
import { SentenceResponseRepository } from './sentence-response.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionResponseRepository,
      SentenceResponseRepository,
    ]),
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
