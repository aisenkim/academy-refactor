import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionRepository } from './question.repository';
import { Question } from './question.entity';

describe('QuestionService', () => {
  let service: QuestionService;
  let repository;

  // mock repository
  const mockQuestionsRepository = () => ({
    getQuestionsByFilter: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: QuestionRepository, useFactory: mockQuestionsRepository },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    repository = module.get<QuestionRepository>(QuestionRepository);
  });

  describe('check service defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getQuestionsByFilter', () => {
    it('should return questions array containing questions for provided level', async () => {
      const mockQuestion = {
        id: 'some id',
        level: 'lt3',
        question_num: 1,
        question: 'word',
        answer: 'meaning',
      };
      repository.getQuestionsByFilter.mockResolvedValue([mockQuestion]);
      const result = await service.getQuestionsByFilter(null);
      expect(result).toEqual([mockQuestion]);
    });
  });
});
