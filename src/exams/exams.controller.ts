import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { ExamsService } from './exams.service';
import { GetUserScoreDto } from './dto/get-user-score.dto';

@Controller('exams')
@UseGuards(AuthGuard('jwt'))
export class ExamsController {
  constructor(private readonly examService: ExamsService) {}

  @Post('/user-scores')
  @Roles('admin')
  getUserScore(@Body() userInfo: GetUserScoreDto) {
    return this.examService.getUserScore(userInfo);
  }
}
