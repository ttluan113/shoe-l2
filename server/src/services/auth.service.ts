import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { jwtDecode } from 'jwt-decode';

import { apiKey, apiKeyDocument } from '../modules/users/schemas/apiKey.schema';

interface DecodedToken {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(apiKey.name) private apiKeyModel: Model<apiKeyDocument>,
  ) {}

  async createApiKey(userId: string) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    const privateKeyString = privateKey.export({
      type: 'pkcs8',
      format: 'pem',
    });

    const publicKeyString = publicKey.export({
      type: 'spki',
      format: 'pem',
    });

    await this.apiKeyModel.create({
      userId: userId,
      publicKey: publicKeyString,
      privateKey: privateKeyString,
    });

    return {
      publicKey: publicKeyString,
      privateKey: privateKeyString,
    };
  }

  async createToken(userId: string, payload: any) {
    const key = await this.apiKeyModel.findOne({ userId: userId });
    if (!key) throw new Error('Không tìm thấy khóa của user');

    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: key.privateKey,
      expiresIn: '15m',
    });
  }

  async createRefreshToken(userId: string, payload: any) {
    const key = await this.apiKeyModel.findOne({ userId: userId });
    if (!key) throw new Error('Không tìm thấy khóa của user');

    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: key.privateKey,
      expiresIn: '7d',
    });
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const findApiKey = await this.apiKeyModel.findOne({ userId: decoded.id });

      if (!findApiKey) {
        throw new UnauthorizedException('Vui lòng đăng nhập lại');
      }

      return this.jwtService.verify(token, {
        secret: findApiKey.publicKey,
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }
  }
}
