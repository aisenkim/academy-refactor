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
import { QuestionService } from './question.service';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { Question } from './question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * GET questions by filter
   * Used for getting questions for populating exams page
   * @param filterDto - level(required), from(optional), to(optional)
   */
  @Get()
  getQuestionsByFilter(
    @Query(ValidationPipe) filterDto: GetQuestionsFilterDto,
  ): Promise<Question[]> {
    return this.questionService.getQuestionsByFilter(filterDto);
  }

  /**
   * GET questions by level
   * @param level - level of a test
   */
  @Get('/:level')
  getQuestions(@Param('level') level: string): Promise<Question[]> {
    return this.questionService.getQuestions(level);
  }

  /**
   * save word(vocab) questions to database
   * @param questionData
   */
  @Post()
  createVocabQuestions(@Body() questionData): Promise<HttpStatus> {
    return this.questionService.createVocabQuestions(questionData);
  }

  /**
   * update currently stored questions by new set of questions
   * if their level is identical and id
   * @param questionData
   */
  @Patch()
  updateVocabQuestions(@Body() questionData): Promise<HttpStatus> {
    return this.questionService.updateVocabQuestions(questionData);
  }

  /**
   * Delete questions by level
   * On success, receives HTTP response : 204
   * @param level - level of a test
   */
  @Delete('/:level')
  deleteVocabQuestions(@Param('level') level: string): Promise<HttpStatus> {
    return this.questionService.deleteVocabQuestions(level);
  }
}
