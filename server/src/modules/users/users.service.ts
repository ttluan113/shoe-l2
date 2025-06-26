import { Model } from 'mongoose';
import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { Response } from 'express';

import { apiKey, apiKeyDocument } from './schemas/apiKey.schema';
import { User, UserDocument } from './schemas/users.schema';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(apiKey.name) private apiKeyModel: Model<apiKeyDocument>,
    private authService: AuthService,
  ) {}
  async register(user: User, res: Response) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (findUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    await newUser.save();

    const payload = { id: newUser._id, email: newUser.email };

    await this.authService.createApiKey(newUser._id.toString());

    const token = await this.authService.createToken(
      newUser._id.toString(),
      payload,
    );
    const refreshToken = await this.authService.createRefreshToken(
      newUser._id.toString(),
      payload,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'Đăng ký thành công',
      user: newUser,
      token,
      refreshToken,
    });
  }
}
