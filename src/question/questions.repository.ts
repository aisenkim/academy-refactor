import { Question } from './question.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(Question)
export class QuestionsRepository extends Repository<Question> {
  /**
   * Used for getting questions for populating exams page
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

  /**
   * Get all questions and answers per level
   * @param level - student level
   */
  async getQuestions(level: string) {
    const query = this.createQueryBuilder('question');
    query
      .where('question.level = :level', { level })
      .orderBy('question_num', 'ASC');
    try {
      return await query.getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * save word(vocab) questions to database
   * Also updates
   * @param questionData
   */
  async createVocabQuestions(questionData): Promise<HttpStatus> {
    const data = questionData.data;
    const level = questionData.level;

    console.log(typeof data);

    try {
      data.shift(); // remove first data (don't need)
    } catch (error) {
      // if provided data is a different type
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const questionList = [];
    for (const line of data) {
      const [questionNum, word, definition, questionNum2, word2, definition2] =
        line;
      questionList.push(
        this.generateQuestionObj(questionNum, word, definition, level),
      );
      if (word2 !== ' ') {
        questionList.push(
          this.generateQuestionObj(questionNum2, word2, definition2, level),
        );
      }
    }

    // word -> save to question db
    try {
      await this.save(questionList);
      return HttpStatus.CREATED;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * When new bulk of questions are provided,
   * deletes previous stored questions and adds new set
   * @param questionData
   */
  async updateVocabQuestions(questionData): Promise<HttpStatus> {
    const level = questionData.level;
    try {
      await this.deleteVocabQuestions(level);
      await this.createVocabQuestions(questionData);
      return HttpStatus.OK;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Delete questions by level
   * On success, receives HTTP response : 204
   * @param level - level of a test
   */
  async deleteVocabQuestions(level: string): Promise<HttpStatus> {
    const query = this.createQueryBuilder('question');
    try {
      await query.delete().where('level = :level', { level }).execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    // if success -> throw 204
    return HttpStatus.NO_CONTENT;
  }

  /** Define Helper Functions */

  /**
   * removes unnecessary parts from the definition
   * @param definition - string of definition
   */
  formatDefinition(definition: string): string {
    return definition
      .split('.')
      .pop()
      .replace(/ *\([^)]*\) */g, '')
      .replace(/\s/g, '');
  }

  /**
   * set a new question object and return it
   * @param questionNum - question number
   * @param word - vocab word
   * @param definition - definition
   * @param testLevel - level of the generating question
   */
  generateQuestionObj(questionNum, word, definition, testLevel) {
    const question: Question = new Question();
    question.id = questionNum + testLevel;
    question.level = testLevel;
    question.question_num = questionNum;
    question.question = word;
    question.answer = this.formatDefinition(definition);
    return question;
  }
}
