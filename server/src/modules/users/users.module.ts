import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/users.schema';
import { apiKey, apiKeySchema } from './schemas/apiKey.schema';
import { UsersService } from './users.service';
import { AuthService } from 'src/services/auth.service';

import * as dotenv from 'dotenv';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: apiKey.name, schema: apiKeySchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/users/auth');
  }
}
