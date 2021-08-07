import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { PlanRepository } from './plan.repository';
import { Plan } from './plan.entity';
import { PlanDto } from './dto/plan.dto';
import { getTodayDate } from '../util/get-todays-date';
import { User } from '../auth/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('PlanService', () => {
  let service: PlanService;
  let repository;

  const plan: PlanDto = {
    testType: 'word',
    level: 'sp3',
    from: 1,
    to: 5,
    questionType: 'meaning',
    testDate: '2021-07-01',
  };
  const invalidPlan: PlanDto = {
    testType: null,
    level: 'sp3',
    from: 1,
    to: 5,
    questionType: 'meaning',
    testDate: '2021-07-01',
  };

  const mockPlanRepository = () => ({
    createPlan: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        { provide: PlanRepository, useFactory: mockPlanRepository },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
    repository = module.get<PlanRepository>(PlanRepository);
  });

  describe('Test setup', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createPlan', () => {
    it('should successfully create a plan', async () => {
      repository.createPlan.mockResolvedValue(undefined);
      await service.createPlan(plan, new User());
      expect(repository.createPlan).toHaveBeenCalledTimes(1);
    });
    // it('should throw internal server error with wrong parameter', async () => {
    //   try {
    //     await expect(
    //       service.createPlan(invalidPlan, new User()),
    //     ).resolves.toThrowError(InternalServerErrorException);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });
  });
});
