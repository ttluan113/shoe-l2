import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }

    try {
      const decoded = await this.authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
