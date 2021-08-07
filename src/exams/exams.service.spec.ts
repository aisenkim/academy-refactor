import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from './exams.service';
import { UsersRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';

describe('ExamsService', () => {
  let service: ExamsService;
  let userRepository: UsersRepository;

  const mockUsersRepository = () => ({ find: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('Check if everything is defined', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  // describe('getUserScore', () => {
  //   const username = 'test';
  //   it('should get user exam scores', () => {
  //     userRepository.find.mockResolvedValue();
  //   });
  // });
});
