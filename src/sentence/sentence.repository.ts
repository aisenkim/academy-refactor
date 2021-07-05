import { Sentence } from './sentence.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetQuestionsFilterDto } from '../question/dto/get-questions-filter.dto';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Sentence)
export class SentenceRepository extends Repository<Sentence> {
  /**
   * Used for getting sentence questions for populating exam page
   * @param filterDto - level(required), from(required), to(required)
   */
  async getSentenceByFilter(filterDto: GetQuestionsFilterDto) {
    const { level, from, to } = filterDto;
    const query = this.createQueryBuilder('sentence');
    query
      .where('sentence.level = :level', { level })
      .andWhere(`sentence.question_num BETWEEN ${from} AND ${to}`)
      .orderBy('question_num', 'ASC');
    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSentence(level: string): Promise<Sentence[]> {
    const query = this.createQueryBuilder('sentence');
    query
      .where('sentence.level = :level', { level })
      .orderBy('question_num', 'ASC');
    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * save sentence questions to database
   * Also updates
   * @param testData - questionData
   */
  async createSentence(testData): Promise<HttpStatus> {
    const data = testData.data;
    const testLevel = testData.level;

    data.shift(); // remove first data (don't need)

    const questionList = [];

    for (const line of data) {
      const [questionNum, word, definition] = line;

      const question = new Sentence();
      question.id = questionNum + testLevel;
      question.level = testLevel;
      question.question_num = questionNum;
      question.question = word;
      question.answer = this.formatDefinition(definition);
      questionList.push(question);
    }
    try {
      await this.save(questionList);
    } catch (error) {
      return HttpStatus.CREATED;
    }
  }

  /**
   * When new bulk of questions are provided,
   * deletes previous stored questions and adds new set
   * @param questionData
   */
  async updateSentence(questionData): Promise<HttpStatus> {
    const level = questionData.level;
    try {
      await this.deleteSentence(level);
      await this.createSentence(questionData);
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
  async deleteSentence(level: string): Promise<HttpStatus> {
    const query = this.createQueryBuilder('sentence');
    try {
      await query.delete().where('level = :level', { level }).execute();
    } catch (error) {
      throw new InternalServerErrorException();
    }
    // if success -> throw 204
    return HttpStatus.NO_CONTENT;
  }

  formatDefinition(definition) {
    return definition
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');
  }
}
