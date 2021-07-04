import {
  Controller,
  Get,
  NotFoundException,
  Param,
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
   * Used for getting questions for populating exam page
   * @param filterDto - level(required), from(optional), to(optional)
   */
  @Get('')
  getQuestionsByFilter(
    @Query(ValidationPipe) filterDto: GetQuestionsFilterDto,
  ): Promise<Question[]> {
    return this.questionService.getQuestionsByFilter(filterDto);
  }

  // /**
  //  * GET questions by level
  //  * @param level - level of a test
  //  */
  // @Get('/:level')
  // getQuestions(@Param('level') level: string): Promise<Question[]> {
  //   return this.questionService.getQuestions();
  // }
}
