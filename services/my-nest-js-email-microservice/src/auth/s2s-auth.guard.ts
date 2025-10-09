import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';

@Injectable()
export class S2SAuthGuard implements CanActivate {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const isValid = this.betterAuthService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
