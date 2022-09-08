import { HttpStatus, Injectable } from '@nestjs/common';
import { resolve as resolvePath } from 'path';
import * as fs from 'fs';
import CustomHttpException from 'src/exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';
import * as sharp from 'sharp';

@Injectable()
class ServeStaticService {

  constructor() {
  }

  async getFile(filePath: string, size?: number) {
    const fileSplitPath = filePath.split('/');
    const fileName = fileSplitPath[fileSplitPath.length - 1];
    const path = resolvePath(__dirname, `../static/${fileSplitPath.slice(0, -1).join('/')}/`);
    try {
      const foundFile = fs.readdirSync(path).filter(v => v.includes(fileName))[0];
      const buffer = size ? await sharp(path + `/${foundFile}`).resize(size).toBuffer() : fs.readFileSync(path + `/${foundFile}`);
      const type = `image/${foundFile.split('.')[1]}`;
      return { buffer, type };
    } catch (e) {
      console.log(e);
      throw new CustomHttpException(ApiExceptions.FileNotFound(), HttpStatus.BAD_REQUEST);
    }
  }
}

export default ServeStaticService;