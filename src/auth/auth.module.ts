import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UsersModule from '../users/users.module';
import JwtStrategy from './jwt/jwt-auth.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
class AuthModule {
}

export default AuthModule;