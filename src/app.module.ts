import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { StaticModule } from './static/static.module';

@Global()
@Module({
  imports: [
    StaticModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    FilesModule,
    PostsModule,
  ],
})
export class AppModule {}
