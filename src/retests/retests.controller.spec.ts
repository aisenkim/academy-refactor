import { Test, TestingModule } from '@nestjs/testing';
import { RetestsController } from './retests.controller';

describe('RetestsController', () => {
  let controller: RetestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetestsController],
    }).compile();

    controller = module.get<RetestsController>(RetestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
