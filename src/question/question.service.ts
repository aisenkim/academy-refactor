import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsRepository } from './questions.repository';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { Question } from './question.entity';
import { User } from '../auth/user.entity';
import { getTodayDate } from '../util/get-todays-date';
import { PlanRepository } from '../plan/plan.repository';
import { Exams } from '../exams/exams.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionsRepository)
    private questionRepository: QuestionsRepository,
    private planRepository: PlanRepository,
  ) {}

  /**
   * Used for getting questions for populating exams page
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
   * Get plan for vocab questions (questions) and query the question
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
    const questions = await this.getQuestionsByFilter({
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
