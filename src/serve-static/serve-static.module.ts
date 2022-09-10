import { Module } from '@nestjs/common';
import ServeStaticService from './serve-static.service';
import ServeStaticController from './serve-static.controller';
import FilesModule from '../files/files.module';

@Module({
  imports: [FilesModule],
  providers: [ServeStaticService],
  controllers: [ServeStaticController],
})
class ServeStaticModule {}

export default ServeStaticModule;
