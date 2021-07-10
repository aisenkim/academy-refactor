import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SentenceRepository } from './sentence.repository';
import { GetQuestionsFilterDto } from '../question/dto/get-questions-filter.dto';
import { SentenceService } from './sentence.service';
import { Sentence } from './sentence.entity';

@Controller('sentence')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  /**
   * Used for getting sentence questions for populating exams page
   * @param filterDto - level(required), from(required), to(required)
   */
  @Get()
  getSentenceByFilter(@Query(ValidationPipe) filterDto: GetQuestionsFilterDto) {
    return this.sentenceService.getSentenceByFilter(filterDto);
  }

  /**
   * GET questions by level
   * @param level - level of a test
   */
  @Get('/:level')
  getSentence(@Param('level') level: string): Promise<Sentence[]> {
    return this.sentenceService.getSentence(level);
  }

  /**
   * save setence questions to database
   * @param questionData
   */
  @Post()
  createSentenceQuestions(@Body() questionData): Promise<HttpStatus> {
    return this.sentenceService.createSentence(questionData);
  }

  /**
   * update currently stored questions by new set of questions
   * if their level is identical and id
   * @param questionData
   */
  @Patch()
  updateVocabQuestions(@Body() questionData): Promise<HttpStatus> {
    return this.sentenceService.updateSentence(questionData);
  }

  /**
   * Delete questions by level
   * On success, receives HTTP response : 204
   * @param level - level of a test
   */
  @Delete('/:level')
  deleteSentenceQuestions(@Param('level') level: string): Promise<HttpStatus> {
    return this.sentenceService.deleteSentence(level);
  }
}
