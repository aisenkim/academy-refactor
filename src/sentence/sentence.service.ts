import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceRepository } from './sentence.repository';
import { GetQuestionsFilterDto } from '../question/dto/get-questions-filter.dto';
import { Sentence } from './sentence.entity';
import { User } from '../auth/user.entity';
import { getTodayDate } from '../util/get-todays-date';
import { PlanRepository } from '../plan/plan.repository';
import { Exams } from '../exams/exams.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(SentenceRepository)
    private sentenceRepository: SentenceRepository,
    private planRepository: PlanRepository,
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
   * Get plan for  sentence questions and query the question
   * based on the plan.
   */
  async getTodayQuestions(user: User, testType: string) {
    const testDate = getTodayDate();

    // get level from user object
    const userLevel = user.level;

    // call getPlan
    const plan = await this.planRepository.getPlan({
      level: userLevel,
      testDate,
      testType,
    });

    // check if plan exists
    if (!plan) {
      return JSON.stringify([]);
    }

    // Check if current user has already taken today's test
    let allExams: Exams[] = user.exams;
    allExams = allExams.filter((exam) => {
      return exam.date === getTodayDate() && exam.testType === 'word';
    });
    if (allExams.length > 0) {
      return JSON.stringify([]);
    }

    const { from, to, questionType } = plan;

    // call getLevelFromQuestions -> receive array of Question Object
    const questions = await this.getSentenceByFilter({
      from,
      to,
      level: userLevel,
    });

    // mixing up question questions depending on questionType {mix, word, meaning}
    if (questionType === 'mixed') {
      questions.map((question) => {
        const isAnswerWord = !!Math.round(Math.random());
        question['isMeaning'] = isAnswerWord;
        // here "word" == english word
        if (!isAnswerWord) {
          const tmp = question.answer;
          question.answer = question.question;
          question.question = tmp;
        }
      });
    } else if (questionType === 'word') {
      questions.map((question) => {
        question['isMeaning'] = false;
        // swap question and answer
        const tmp = question.answer;
        question.answer = question.question;
        question.question = tmp;
      });
    } else {
      questions.map((question) => {
        question['isMeaning'] = true;
      });
    }

    return JSON.stringify(questions);
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
