import { Exams } from './exams.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { getTodayDate } from '../util/get-todays-date';

@EntityRepository(Exams)
export class ExamRepository extends Repository<Exams> {
  /**
   * saves exam and if successful, returns the exam
   */
  async saveExam(
    testType: string,
    range: string,
    isPass: boolean,
    user: User,
    average: number,
    retest: boolean,
  ): Promise<Exams> {
    const exam = new Exams();
    exam.testType = testType;
    exam.range = range;
    exam.date = getTodayDate();
    exam.level = user.level;
    exam.isPass = isPass;
    exam.user = user;
    exam.average = average;
    exam.retest = retest;
    await exam.save();
    return exam;
  }
}
