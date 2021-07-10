import { Test, TestingModule } from '@nestjs/testing';
import { RetestsService } from './retests.service';

describe('RetestsService', () => {
  let service: RetestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetestsService],
    }).compile();

    service = module.get<RetestsService>(RetestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
