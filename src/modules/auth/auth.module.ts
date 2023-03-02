import { forwardRef, Module } from '@nestjs/common';
import { JWTStrategy } from 'src/strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

dotenv.config({ path: '.development.env' });

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JWTStrategy, JwtService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
