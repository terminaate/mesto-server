import { Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from './models/users.model';
import UserToken, { UserTokenSchema } from './models/users-tokens.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersModule {
}

export default UsersModule;
