import { Test, TestingModule } from '@nestjs/testing';
import { ResponseController } from './response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionResponseRepository } from './question-response.repository';
import { SentenceResponseRepository } from './sentence-response.repository';
import { ExamRepository } from '../exams/exam.repository';
import { ResponseService } from './response.service';
import { QuestionsRepository } from '../question/questions.repository';
import { SentenceRepository } from '../sentence/sentence.repository';
import { QuestionController } from '../question/question.controller';
import { ResponseDto } from './dto/submit-response-dto';
import { typeOrmTestingConfig } from '../config/typeorm.testing.config';
import { AuthController } from '../auth/auth.controller';
import { Role } from '../auth/role.enum';

describe('ResponseController', () => {
  let module: TestingModule;
  let controller: ResponseController;
  let questionRepository: QuestionsRepository;
  let sentenceRepository: SentenceRepository;
  let questionController: QuestionController;
  let authController: AuthController;

  const questionData = {
    data: [
      ['No', 'Spelling', 'Meaning', 'No', 'Spelling', 'Meaning'],
      [1, 'scream', 'v. 비명을 지르다, 괴성을 지르다', 2, 'fight', 'v. 싸우다'],
    ],
    level: 'lt3',
  };

  const responseData: ResponseDto = {
    question_num: [1, 2],
    questions: ['scream', 'fight'],
    range: 'lt3_1_2',
    answer: ['비명을 지르다, 괴성을 지르다', '싸우다'],
    myAnswers: ['비명을 지르다, 괴성을 지르다', '싸우다'],
    isMeaning: [true, true],
    testType: 'word',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ResponseController],
      imports: [
        TypeOrmModule.forRoot(typeOrmTestingConfig),
        TypeOrmModule.forFeature([
          QuestionResponseRepository,
          SentenceResponseRepository,
          ExamRepository,
        ]),
      ],
      providers: [ResponseService],
    }).compile();

    controller = module.get<ResponseController>(ResponseController);
    questionRepository = module.get<QuestionsRepository>(QuestionsRepository);
    sentenceRepository = module.get<SentenceRepository>(SentenceRepository);
    questionController = module.get<QuestionController>(QuestionController);
    authController = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('saveResponses', () => {
  //   it('should save the exam results to exam db and save responses to corresponding db', () => {
  //     // sign up user
  //     authController.signUp({
  //       username: 'test',
  //       password: 'test',
  //       role: Role.USER,
  //     });
  //     // sign in user
  //     authController.signIn({
  //       username: 'test',
  //       password: 'test',
  //       role: Role.USER,
  //     });
  //     questionController.createVocabQuestions(questionData);
  //     controller.submitResponse(responseData);
  //   });
  // });
});
