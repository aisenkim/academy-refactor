import { EntityRepository, Repository } from 'typeorm';
import { QuestionResponse } from './question-response.entity';

@EntityRepository(QuestionResponse)
export class QuestionResponseRepository extends Repository<QuestionResponse> {}
