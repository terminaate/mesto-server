import { forwardRef, Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { JwtModule } from '@nestjs/jwt';
import FilesModule from '../files/files.module';
import { PostsModule } from '../posts/posts.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './models/users.model';
import UserToken from './models/users-tokens.model';

@Module({
  imports: [
    JwtModule.register({}),
    FilesModule,
    SequelizeModule.forFeature([User, UserToken]),
    forwardRef(() => PostsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersModule {
}

export default UsersModule;
