import { EntityRepository, Repository } from 'typeorm';
import { SentenceResponse } from './sentece-response.entity';
import { Exams } from '../exams/exams.entity';

@EntityRepository(SentenceResponse)
export class SentenceResponseRepository extends Repository<SentenceResponse> {
  async saveResponse(
    question_num: number[],
    myAnswers: string[],
    isCorrect: boolean[],
    isMeaning: boolean[],
    savedExam: Exams,
  ) {
    const sentenceResponses: SentenceResponse[] = [];
    for (let i = 0; i < question_num.length; i++) {
      const sentenceResponse: SentenceResponse = new SentenceResponse();
      sentenceResponse.question_num = question_num[i];
      sentenceResponse.answer = myAnswers[i];
      sentenceResponse.isCorrect = isCorrect[i];
      sentenceResponse.isMeaning = isMeaning[i];
      sentenceResponse.exams = savedExam;
      sentenceResponses.push(sentenceResponse);
    }
    await this.save(sentenceResponses);
  }

  async updateResponse(responseId: string, data) {
    const response = await this.findOne({ id: responseId });
    const { isCorrect } = data;
    response.isCorrect = isCorrect;
    await response.save();
  }

  async getResponses(examId: number): Promise<SentenceResponse[]> {
    return await this.find({
      where: {
        exams: { id: examId },
      },
      relations: ['exams'],
    });
  }
}
