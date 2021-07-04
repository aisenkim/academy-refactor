import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from './question.repository';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {}

  /**
   * Used for getting questions for populating exam page
   * @param filterDto - level(required), from(optional), to(optional)
   */
  async getQuestionsByFilter(
    filterDto: GetQuestionsFilterDto,
  ): Promise<Question[]> {
    return this.questionRepository.getQuestionsByFilter(filterDto);
  }
}
