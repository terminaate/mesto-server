import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './models/post.model';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { PostsRepository } from './posts.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    FilesModule,
    forwardRef(() => UsersModule),
    JwtModule.register({}),
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
