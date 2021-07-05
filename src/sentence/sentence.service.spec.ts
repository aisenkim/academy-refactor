import { Test, TestingModule } from '@nestjs/testing';
import { SentenceService } from './sentence.service';
import { SentenceRepository } from './sentence.repository';

describe('SentenceService', () => {
  let service: SentenceService;
  let repository;

  // mock repository
  const mockSentenceRepository = () => ({
    getSentenceByFilter: jest.fn(),
    getSentence: jest.fn(),
    createSentence: jest.fn(),
    updateSentence: jest.fn(),
    deleteSentence: jest.fn(),
  });

  const mockSentence = {
    id: 'some id',
    level: 'lt3',
    question_num: 1,
    question: 'sentence',
    answer: 'meaning',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentenceService,
        { provide: SentenceRepository, useFactory: mockSentenceRepository },
      ],
    }).compile();

    service = module.get<SentenceService>(SentenceService);
    repository = module.get<SentenceRepository>(SentenceRepository);
  });
  describe('Check if service is defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getSentenceByFilter', () => {
    it('should return sentence array containing sentence questions for provided level and range', async () => {
      repository.getSentenceByFilter.mockResolvedValue([mockSentence]);
      const result = await service.getSentenceByFilter(null);
      expect(result).toEqual([mockSentence]);
    });
  });

  describe('getSentence', () => {
    it('should return sentence array containing sentence questions for provided level', async () => {
      repository.getSentence.mockResolvedValue([mockSentence]);
      const result = await service.getSentence(null);
      expect(result).toEqual([mockSentence]);
    });
  });

  describe('createSentence', () => {
    it('should save provided array of Sentence obejct to DB and return Created code', async () => {
      repository.createSentence.mockResolvedValue(201);
      const result = await service.createSentence(null);
      expect(result).toEqual(201);
    });
  });

  describe('updateSentence', () => {
    it('should delete matching level objects in db and save provided array of Sentence obejcts to DB and return Created code', async () => {
      repository.updateSentence.mockResolvedValue(200);
      const result = await service.updateSentence(null);
      expect(result).toEqual(200);
    });
  });

  describe('deleteSentence', () => {
    it('should delete matching level objects in db', async () => {
      repository.deleteSentence.mockResolvedValue(204);
      const result = await service.deleteSentence(null);
      expect(result).toEqual(204);
    });
  });
});
