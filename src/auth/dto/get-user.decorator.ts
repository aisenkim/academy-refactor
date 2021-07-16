import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

/**
 * What ever is returned becomes the parameter of the decorator
 */
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    // ctx -> context
    // get request body
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
