import { EntityRepository, Repository } from 'typeorm';
import { Retest } from './retest.entity';
import { RetestDto } from './dto/retest.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Retest)
export class RetestRepository extends Repository<Retest> {
  /**
   * Saves retest information to the retest table (DB)
   * @param retestDto
   */
  async saveRetest(retestDto: RetestDto): Promise<Retest> {
    const retest = new Retest();
    retest.isComplete = retestDto.isComplete;
    retest.range = retestDto.range;
    retest.testDate = retestDto.testDate;
    retest.testType = retestDto.testType;
    retest.user = retestDto.user;
    retest.questionType = retestDto.questionType;
    await retest.save();
    return retest;
  }

  getRetests(user: User) {
    return user.retest;
  }

  async findRetest(range: string, testType: string): Promise<Retest> {
    return await this.findOne({ where: { range, testType } });
  }

  async deleteRetest(range: string, testType: string) {
    await this.createQueryBuilder()
      .delete()
      .from(Retest)
      .where('range = :range', { range })
      .andWhere('testType = :testType', { testType })
      .execute();
  }
}
