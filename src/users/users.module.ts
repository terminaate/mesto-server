import { forwardRef, Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { JwtModule } from '@nestjs/jwt';
import FilesModule from '../files/files.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    JwtModule.register({}),
    FilesModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersModule {
}

export default UsersModule;
