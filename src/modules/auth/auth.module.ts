import { Module } from '@nestjs/common';
import { JWTStrategy } from 'src/strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.development.env' });

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  exports: [AuthService, UsersModule],
})
export class AuthModule {}
