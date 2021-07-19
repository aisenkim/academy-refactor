import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseDto } from './dto/submit-response-dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('response')
@UseGuards(AuthGuard('jwt'))
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  /**
   * Submit a response to either question response || sentence response
   * Save exam results (grade / percentage / etc)
   * Save response per question to corresponding table
   * @param submittedResponse
   * @param user
   */
  @Post()
  submitResponse(
    @Body() submittedResponse: ResponseDto,
    @GetUser() user: User,
  ) {
    return this.responseService.submitResponses(submittedResponse, user);
  }
}
