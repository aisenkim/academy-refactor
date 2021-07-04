import { Question } from './question.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
  /**
   * Used for getting questions for populating exam page
   * @param filterDto - level(required), from(optional), to(optional)
   */
  async getQuestionsByFilter(filterDto: GetQuestionsFilterDto) {
    const { level, from, to } = filterDto;
    const query = this.createQueryBuilder('question');
    query
      .where('question.level = :level', { level })
      .orderBy('question_num', 'ASC');

    // apply range if both "from" and "to" are valid
    if (from && to) {
      query.andWhere(`question.question_num BETWEEN ${from} AND ${to}`);
    }
    try {
      return await query.getMany(); // return questions
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
