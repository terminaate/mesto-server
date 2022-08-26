import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UsersModule from '../users/users.module';
import JwtStrategy from './guards/jwt-auth.strategy';
import FilesModule from '../files/files.module';
import RolesModule from '../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    FilesModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
class AuthModule {
}

export default AuthModule;