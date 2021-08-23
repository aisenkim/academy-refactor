import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ResponseDto } from './dto/submit-response-dto';
import { User } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionResponseRepository } from './question-response.repository';
import { SentenceResponseRepository } from './sentence-response.repository';
import { ExamRepository } from '../exams/exam.repository';
import { Exams } from '../exams/exams.entity';
import { RetestRepository } from '../retests/retest.repository';
import { RetestDto } from '../retests/dto/retest.dto';
import { getTodayDate } from '../util/get-todays-date';
import { QuestionResponse } from './question-response.entity';
import { SentenceResponse } from './sentece-response.entity';
import { Constants } from '../util/constants';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(QuestionResponseRepository)
    private qResponseRepository: QuestionResponseRepository,
    @InjectRepository(SentenceResponseRepository)
    private sResponseRepository: SentenceResponseRepository,
    private examRepository: ExamRepository,
    private retestRepository: RetestRepository,
    private readonly planService: PlanService,
  ) {}

  async submitResponses(submittedResponses: ResponseDto, user: User) {
    const {
      question_num,
      range,
      answer,
      myAnswers,
      isMeaning,
      retest,
      testType,
    } = submittedResponses;

    // 1. check answers
    // 2. get average (check pass or fail)
    const { isCorrect, isPass, average } = this.checkAnswer(answer, myAnswers);

    // 3. post to Exam table
    let savedExam: Exams;
    try {
      savedExam = await this.examRepository.saveExam(
        testType,
        range,
        isPass,
        user,
        average,
        retest,
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }

    // check question type of each response
    let questionType = '';
    const allEquals = (arr) => arr.every((value) => value === arr[0]);
    if (allEquals(isMeaning) && !isMeaning[0]) {
      // if type word...
      questionType = 'word';
    } else if (allEquals(isMeaning) && isMeaning[0]) {
      // if type is meaning...
      questionType = 'meaning';
    } else {
      questionType = 'mixed';
    }

    // if current test is retest, delete it from retest table
    // if the person gets re-retest, then it will be saved again
    if (retest) {
      await this.retestRepository.deleteRetest(range, testType);
    }

    // post to retest table if didn't pass
    // retest table is basically the same as plan table
    if (!isPass) {
      try {
        const retestDto: RetestDto = {
          isComplete: false,
          testType,
          testDate: getTodayDate(),
          range,
          user,
          questionType,
        };
        await this.retestRepository.saveRetest(retestDto);
      } catch (err) {
        throw new InternalServerErrorException();
      }
    }

    // if retest -> don't need to execute future code -> exit
    if (retest) return;

    // 4. post each line to ExamQuestion (perform bulk insert)
    // https://orkhan.gitbook.io/typeorm/docs/insert-query-builder
    try {
      if (testType === 'word') {
        await this.qResponseRepository.saveResponse(
          question_num,
          myAnswers,
          isCorrect,
          isMeaning,
          savedExam,
        );
      } else {
        await this.sResponseRepository.saveResponse(
          question_num,
          myAnswers,
          isCorrect,
          isMeaning,
          savedExam,
        );
      }
      // 5. delete the completed plan from user
      // TODO - Add plan repository and then by using the method, delete the user plan that is completed
      const [level, fromString, toString] = range.split('_');
      const from = parseInt(fromString);
      const to = parseInt(toString);
      await this.planService.deletePlanByUser(user, {
        level,
        from,
        to,
        testType,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Checks if user got each question right and returns if he/she passed the exam
   * @param answer - correct answer
   * @param myAnswer - answer entered by user
   * @returns - isCorrect: contain true or false for each question && isPass: tells if user passed
   */
  checkAnswer(
    answer,
    myAnswer,
  ): { isCorrect: boolean[]; isPass: boolean; average: number } {
    // TODO - (https://en.wikipedia.org/wiki/Levenshtein_distance)
    const isCorrect: boolean[] = [];
    let correctNum = 0;
    const passGrade = Constants.PASS_GRADE;

    for (let i = 0; i < answer.length; i++) {
      // to remove empty space and make case insensitive
      const correctAnswers = answer[i]
        .toUpperCase()
        .replace(/\s/g, '')
        .split(',');
      const myA = myAnswer[i].toUpperCase().replace(/\s/g, '');

      let correct = false;

      for (const answer of correctAnswers) {
        if (answer === myA) {
          correct = true;
          correctNum++;
          break;
        } else {
          correct = false;
        }
      }
      isCorrect.push(correct);
    }
    //
    // isCorrect.push(answer[i].toUpperCase() === myAnswer[i].toUpperCase());
    // if (isCorrect[i]) correctNum++;
    // }

    const average: number = Math.round((correctNum / answer.length) * 100);
    const isPass: boolean = average >= passGrade;

    return { isCorrect, isPass, average };
  }

  async updateResponse(responseId: string, data): Promise<void> {
    const { examId, range, testType } = data; // examType -> word or sentence type of exam

    if (testType === 'word') {
      await this.qResponseRepository.updateResponse(responseId, data);
    } else {
      await this.sResponseRepository.updateResponse(responseId, data);
    }

    // get all responses associated with the examid (examsId field in DB)
    let responses: QuestionResponse[] | SentenceResponse[];

    if (testType === 'word') {
      responses = await this.qResponseRepository.getResponses(examId);
    } else {
      responses = await this.sResponseRepository.getResponses(examId);
    }

    // calculate average, get value of (isPass, retest)
    let correctCount = 0;
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].isCorrect) {
        correctCount++;
      }
    }

    const newAverage: number = Math.round(
      (correctCount / responses.length) * 100,
    );
    const isPass: boolean = newAverage >= Constants.PASS_GRADE;
    const isRetest = !isPass;

    // call updateExam from exam repository
    await this.examRepository.updateExam(examId, newAverage, isPass, isRetest);

    // possibly need to erase retest from user if user went from retest: true to retest false
    const retest = await this.retestRepository.findOne({
      range,
      testType,
    });

    if (retest && isPass) {
      await this.retestRepository.delete({ range });
    }
  }
}
