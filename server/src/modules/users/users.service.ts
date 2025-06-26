import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { jwtDecode } from 'jwt-decode';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as CryptoJS from 'crypto-js';

import { User, UserDocument } from './schemas/users.schema';
import { AuthService } from 'src/services/auth.service';

interface DecodedToken {
  id: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

    res.cookie('logged', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

  async login(user: User, res: Response) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new BadRequestException('Email không tồn tại');
    }

    const isMatch = await bcrypt.compare(user.password, findUser.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    const payload = { id: findUser._id, email: findUser.email };

    const token = await this.authService.createToken(
      findUser._id.toString(),
      payload,
    );
    const refreshToken = await this.authService.createRefreshToken(
      findUser._id.toString(),
      payload,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('logged', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: findUser,
      token,
      refreshToken,
    });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwtDecode<DecodedToken>(refreshToken);
    const payload = { id: decoded.id, email: decoded.email };
    const token = await this.authService.createToken(decoded.id, payload);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('logged', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Refresh token thành công',
      token,
    });
  }

  async authUser(req: Request, res: Response) {
    const { id } = req.user;
    const findUser = await this.userModel.findById(id);
    if (!findUser) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }
    const userString = JSON.stringify(findUser);
    const auth = CryptoJS.AES.encrypt(
      userString,
      process.env.SECRET_CRYPTO,
    ).toString();
    return res.status(200).json({
      message: 'success',
      auth,
    });
  }
}
