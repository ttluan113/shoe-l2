import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { Request, Response } from 'express';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: User, @Res() res: Response) {
    return this.usersService.register(user, res);
  }

  @Post('login')
  async login(@Body() user: User, @Res() res: Response) {
    return this.usersService.login(user, res);
  }

  @Get('auth')
  async auth(@Req() req: Request, @Res() res: Response) {
    return this.usersService.authUser(req, res);
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.usersService.refreshToken(req, res);
  }
}
