import { Module } from '@nestjs/common';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  providers: [StaticService],
  controllers: [StaticController],
})
export class StaticModule {}
