import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmTestingConfig } from '../config/typeorm.testing.config';
import { QuestionsRepository } from './questions.repository';
import { QuestionService } from './question.service';
import { HttpException } from '@nestjs/common';

/**
 * Integration Testing
 */
describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;
  let repository: QuestionsRepository;
  let module: TestingModule;

  const questionData = {
    data: [
      ['No', 'Spelling', 'Meaning', 'No', 'Spelling', 'Meaning'],
      [1, 'scream', 'v. 비명을 지르다, 괴성을 지르다', 2, 'fight', 'v. 싸우다'],
    ],
    level: 'lt3',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmTestingConfig),
        TypeOrmModule.forFeature([QuestionsRepository]),
      ],
      controllers: [QuestionController],
      providers: [QuestionService],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
    repository = module.get<QuestionsRepository>(QuestionsRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('check for connection', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('[CREATE] and [DELETE] vocab questions', () => {
    it('should be saved in the database and return 201', async () => {
      const result = await controller.createVocabQuestions(questionData);
      expect(result).toEqual(201);
    });

    it('should delete form the database', async () => {
      const result = await controller.deleteVocabQuestions('lt3');
      expect(result).toEqual(204);
    });
  });

  describe('[CREATE] vocab questions without parameter', () => {
    it('should throw a Bad Request Error', async () => {
      try {
        await controller.createVocabQuestions(23);
      } catch (error) {
        expect(error.status).toEqual(400);
      }
    });
  });
});
