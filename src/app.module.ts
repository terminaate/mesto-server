import { Module } from '@nestjs/common';
import AuthModule from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import FilesModule from './files/files.module';
import RolesModule from './roles/roles.module';
import UsersModule from './users/users.module';
import { PostsModule } from './posts/posts.module';
import ServeStaticModule from './serve-static/serve-static.module';
import { SequelizeModule } from '@nestjs/sequelize';
import User from './users/models/users.model';
import UserToken from './users/models/users-tokens.model';
import Role from './roles/roles.model';
import Post from './posts/posts.model';
import UserRole from './roles/user-role.model';
import UserPost from './posts/user-post.model';

@Module({
  imports: [
    ServeStaticModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './mesto.db',
      autoLoadModels: true,
      omitNull: true,
      synchronize: true,
      models: [User, UserToken, Role, UserRole, Post, UserPost]
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    RolesModule,
    PostsModule,
  ],
})
export class AppModule {
}
