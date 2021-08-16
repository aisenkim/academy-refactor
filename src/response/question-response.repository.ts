import { EntityRepository, Repository } from 'typeorm';
import { QuestionResponse } from './question-response.entity';
import { Exams } from '../exams/exams.entity';

@EntityRepository(QuestionResponse)
export class QuestionResponseRepository extends Repository<QuestionResponse> {
  async saveResponse(
    question_num: number[],
    myAnswers: string[],
    isCorrect: boolean[],
    isMeaning: boolean[],
    savedExam: Exams,
  ) {
    const wordResponses: QuestionResponse[] = [];
    for (let i = 0; i < question_num.length; i++) {
      const wordResponse: QuestionResponse = new QuestionResponse();
      wordResponse.question_num = question_num[i];
      wordResponse.answer = myAnswers[i];
      wordResponse.isCorrect = isCorrect[i];
      wordResponse.isMeaning = isMeaning[i];
      wordResponse.exams = savedExam;
      wordResponses.push(wordResponse);
    }
    await this.save(wordResponses);
  }

  async updateResponse(responseId: string, data): Promise<void> {
    const response = await this.findOne({ id: responseId });
    const { isCorrect } = data;
    response.isCorrect = isCorrect;
    await response.save();
  }

  /**
   * return all responses associated with the examId
   * @param examId
   */
  async getResponses(examId: number): Promise<QuestionResponse[]> {
    return await this.find({
      where: {
        exams: { id: examId },
      },
      relations: ['exams'],
    });
  }
}
