import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamRepository } from './exam.repository';
import { GetUserScoreDto } from './dto/get-user-score.dto';
import { UsersRepository } from '../auth/user.repository';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(ExamRepository) private examRepository: ExamRepository,
    private userRepository: UsersRepository,
  ) {}

  async getUserScore(userInfo: GetUserScoreDto) {
    const { username } = userInfo;

    // able to grab exam from user and examQuestion from exam
    // Reference: https://github.com/typeorm/typeorm/issues/1270
    const examRecords = await this.userRepository.find({
      where: { username },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          exams: 'user.exams',
          examQuestion: 'exams.examQuestion',
          sentenceResponses: 'exams.sentenceResponses',
        },
      },
    });
    return examRecords[0].exams;
  }
}
