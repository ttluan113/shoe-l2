import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { Response } from 'express';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() user: User, @Res() res: Response) {
    return this.usersService.register(user, res);
  }
}
