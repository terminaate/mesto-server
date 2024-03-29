import { Module } from '@nestjs/common';
import FilesService from './files.service';

@Module({
  providers: [FilesService],
  exports: [FilesService],
})
class FilesModule {}

export default FilesModule;
