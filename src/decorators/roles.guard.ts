import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // get from metadata or from "roles.decorator.ts"
    const requiredRole = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.roles === requiredRole) {
      return true;
    } else {
      return false;
    }
  }
}
