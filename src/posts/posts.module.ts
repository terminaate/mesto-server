import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import FilesModule from '../files/files.module';
import UsersModule from '../users/users.module';

@Module({
  imports: [
    FilesModule,
    forwardRef(() => UsersModule),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
