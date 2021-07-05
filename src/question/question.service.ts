import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsRepository } from './questions.repository';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionsRepository)
    private questionRepository: QuestionsRepository,
  ) {}

  /**
   * Used for getting questions for populating exam page
   * @param filterDto - level(required), from(required), to(required)
   */
  async getQuestionsByFilter(
    filterDto: GetQuestionsFilterDto,
  ): Promise<Question[]> {
    return this.questionRepository.getQuestionsByFilter(filterDto);
  }

  /**
   * GET questions by level
   * @param level - level of a test
   */
  async getQuestions(level: string): Promise<Question[]> {
    return await this.questionRepository.getQuestions(level);
  }

  /**
   * save word(vocab) questions to database
   * @param questionData
   */
  createVocabQuestions(questionData): Promise<HttpStatus> {
    return this.questionRepository.createVocabQuestions(questionData);
  }

  updateVocabQuestions(questionData): Promise<HttpStatus> {
    return this.questionRepository.updateVocabQuestions(questionData);
  }

  /**
   * Delete questions by level
   * On success, receives HTTP response : 204
   * @param level - level of a test
   */
  async deleteVocabQuestions(level: string): Promise<HttpStatus> {
    return await this.questionRepository.deleteVocabQuestions(level);
  }
}
