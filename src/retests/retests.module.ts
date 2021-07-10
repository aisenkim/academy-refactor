import { Module } from '@nestjs/common';
import { RetestsController } from './retests.controller';
import { RetestsService } from './retests.service';

@Module({
  controllers: [RetestsController],
  providers: [RetestsService]
})
export class RetestsModule {}
