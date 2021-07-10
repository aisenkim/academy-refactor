import { EntityRepository, Repository } from 'typeorm';
import { SentenceResponse } from './sentece-response.entity';

@EntityRepository(SentenceResponse)
export class SentenceResponseRepository extends Repository<SentenceResponse> {}
