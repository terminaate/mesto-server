import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import FilesModule from '../files/files.module';
import UsersModule from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import Post from './posts.model';

@Module({
  imports: [
    FilesModule,
    SequelizeModule.forFeature([Post]),
    forwardRef(() => UsersModule),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
