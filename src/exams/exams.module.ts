import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/user.repository';
import { ExamRepository } from './exam.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, ExamRepository])],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
