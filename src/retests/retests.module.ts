import { Module } from '@nestjs/common';
import { RetestsController } from './retests.controller';
import { RetestsService } from './retests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetestRepository } from './retest.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RetestRepository])],
  controllers: [RetestsController],
  providers: [RetestsService],
})
export class RetestsModule {}
