import { HttpStatus, Injectable } from '@nestjs/common';
import { resolve as resolvePath } from 'path';
import * as fs from 'fs';
import FilesService from '../files/files.service';
import CustomHttpException from 'src/exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';

@Injectable()
class ServeStaticService {

  constructor(
    private filesService: FilesService,
  ) {
  }

  getFile(filePath: string) {
    const fileSplitPath = filePath.split('/');
    const fileName = fileSplitPath[fileSplitPath.length - 1]
    const path = resolvePath(__dirname, `../static/${fileSplitPath.slice(0, -1).join("/")}/`);
    try {
      const findedFile = fs.readdirSync(path).filter(v => v.includes(fileName))[0]
      console.log(findedFile, path + findedFile)
      const buffer = fs.readFileSync(path + `/${findedFile}`);
      const type = `image/${findedFile.split(".")[1]}`;
      return { buffer, type };
    } catch (e) {
      throw new CustomHttpException(ApiExceptions.FileNotFound(), HttpStatus.BAD_REQUEST);
    }
  }
}

export default ServeStaticService;