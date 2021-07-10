import { Body, Controller, Post } from '@nestjs/common';

@Controller('exams')
export class ExamsController {
  /**
   * saving question response into question-response or sentence-response
   * then save the results and corresponding info to exam table
   * @param testData - contains response to questions
   */
  // @Post()
  // createExam(@Body() testData) {}
}
