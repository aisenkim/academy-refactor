import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { QuestionsRepository } from './questions.repository';
import { HttpStatus } from '@nestjs/common';

describe('QuestionService', () => {
  let service: QuestionService;
  let repository;

  // mock repository
  const mockQuestionsRepository = () => ({
    getQuestionsByFilter: jest.fn(),
    getQuestions: jest.fn(),
    deleteVocabQuestions: jest.fn(),
    updateVocabQuestions: jest.fn(),
    createVocabQuestions: jest.fn(),
  });

  const mockQuestion = {
    id: 'some id',
    level: 'lt3',
    question_num: 1,
    question: 'word',
    answer: 'meaning',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: QuestionsRepository, useFactory: mockQuestionsRepository },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    repository = module.get<QuestionsRepository>(QuestionsRepository);
  });

  describe('check service defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getQuestionsByFilter', () => {
    it('should return questions array containing questions for provided level', async () => {
      repository.getQuestionsByFilter.mockResolvedValue([mockQuestion]);
      const result = await service.getQuestionsByFilter(null);
      expect(result).toEqual([mockQuestion]);
    });
  });

  describe('getQuestions', () => {
    it('should return array of questions by level', async () => {
      repository.getQuestions.mockResolvedValue([mockQuestion]);
      const result = await service.getQuestions('lt3');
      expect(result).toEqual([mockQuestion]);
    });
  });

  describe('deleteVocabQuestions', () => {
    it('should delete all questions by level', async () => {
      repository.deleteVocabQuestions.mockResolvedValue(204);
      const result: HttpStatus = await service.deleteVocabQuestions('level');
      expect(result).toEqual(204);
    });
    // it('throws an internal server error when fails to delete', async () => {
    //   repository.deleteQuestions.mockResolvedValue(
    //     new InternalServerErrorException(),
    //   );
    //   const result = await service.deleteQuestions(null);
    //   expect(result).toBeInstanceOf(InternalServerErrorException);
    // });
  });

  describe('createVocabQuestion', () => {
    it('should create and save questions to db and return success http code', async () => {
      repository.createVocabQuestions.mockResolvedValue(201);
      const result: HttpStatus = await service.createVocabQuestions('level');
      expect(result).toEqual(201);
    });
  });

  describe('updateVocabQuestion', () => {
    it('should delete and create all questions that are equal to the provided level', async () => {
      repository.updateVocabQuestions.mockResolvedValue(200);
      const result: HttpStatus = await service.updateVocabQuestions('level');
      expect(result).toEqual(200);
    });
  });
});
