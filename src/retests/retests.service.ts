import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RetestRepository } from './retest.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Retest } from './retest.entity';
import { QuestionService } from '../question/question.service';
import { SentenceService } from '../sentence/sentence.service';

@Injectable()
export class RetestsService {
  constructor(
    @InjectRepository(RetestRepository)
    private retestRepository: RetestRepository,
    private questionService: QuestionService,
    private sentenceService: SentenceService,
  ) {}

  /**
   * look through current user's one to many relationship between Retest table
   */
  getRetests(user: User) {
    return this.retestRepository.getRetests(user);
  }

  async getRetestsQuestions(range: string, testType: string) {
    let questions: any = null;
    const retestPlan: Retest = await this.retestRepository.findRetest(
      range,
      testType,
    );

    if (retestPlan === null) {
      throw new InternalServerErrorException("Retest doesn't exist");
    }

    const split_range: string[] = range.split('_');
    const level = split_range[0];
    const from = parseInt(split_range[1]);
    const to = parseInt(split_range[2]);

    // word || meaning || mixed
    const { questionType } = retestPlan;

    if (testType === 'word') {
      questions = await this.questionService.getQuestionsByFilter({
        level,
        from,
        to,
      });
      questions.map((question) => {
        if (questionType === 'word') {
          question['isMeaning'] = false;
          // swap question and answer
          const tmp = question.answer;
          question.answer = question.question;
          question.question = tmp;
        } else if (questionType === 'meaning') {
          question['isMeaning'] = true;
        } else {
          // mixed
          const isAnswerWord = !!Math.round(Math.random());
          question['isMeaning'] = isAnswerWord;
          // here "word" == english word
          if (!isAnswerWord) {
            const tmp = question.answer;
            question.answer = question.question;
            question.question = tmp;
          }
        }
      });
      return questions;
    } else {
      // if testType === "sentence"
      questions = await this.sentenceService.getSentenceByFilter({
        level,
        from,
        to,
      });
      return questions;
    }
  }
}
