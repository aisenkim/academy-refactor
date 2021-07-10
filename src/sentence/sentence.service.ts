import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceRepository } from './sentence.repository';
import { GetQuestionsFilterDto } from '../question/dto/get-questions-filter.dto';
import { Sentence } from './sentence.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(SentenceRepository)
    private sentenceRepository: SentenceRepository,
  ) {}

  /**
   * Used for getting sentence questions for populating exams page
   * @param filterDto - level(required), from(required), to(required)
   */
  async getSentenceByFilter(
    filterDto: GetQuestionsFilterDto,
  ): Promise<Sentence[]> {
    return this.sentenceRepository.getSentenceByFilter(filterDto);
  }

  /**
   * GET questions by level
   * @param level - level of a test
   */
  async getSentence(level: string): Promise<Sentence[]> {
    return this.sentenceRepository.getSentence(level);
  }

  /**
   * save setence questions to database
   * @param questionData
   */
  async createSentence(questionData): Promise<HttpStatus> {
    return this.sentenceRepository.createSentence(questionData);
  }

  /**
   * update currently stored questions by new set of questions
   * if their level is identical and id
   * @param questionData
   */
  async updateSentence(questionData): Promise<HttpStatus> {
    return this.sentenceRepository.updateSentence(questionData);
  }

  /**
   * Delete questions by level
   * On success, receives HTTP response : 204
   * @param level - level of a test
   */
  async deleteSentence(level: string): Promise<HttpStatus> {
    return this.sentenceRepository.deleteSentence(level);
  }
}
