import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import FilesModule from './files/files.module';
import RolesModule from './roles/roles.module';
import UsersModule from './users/users.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
import ServeStaticModule from './serve-static/serve-static.module';

@Module({
  imports: [
    ServeStaticModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    FilesModule,
    RolesModule,
  ],
})
export class AppModule {
}
