import { Injectable } from '@nestjs/common';
import { resolve as resolvePath } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { StaticException } from './static.exception';

export type StaticServiceFile = {
  buffer: Buffer;
  type: string;
};

@Injectable()
export class StaticService {
  public async getFile(filePath: string, size?: number): Promise<StaticServiceFile> {
    const arrayFilePath = filePath.split('/');
    const fileName = arrayFilePath.at(-1);
    const pathToDir = arrayFilePath.slice(0, -1).join('/');
    const dirPath = resolvePath(__dirname, `../static/${pathToDir}/`);

    try {
      const candidate = fs.readdirSync(dirPath).filter((v) => v.includes(fileName))[0];
      const pathToFile = `${dirPath}/${candidate}`;

      let buffer;
      if (size) {
        buffer = await sharp(pathToFile).resize(size).toBuffer();
      } else {
        buffer = fs.readFileSync(pathToFile);
      }
      const type = `image/${candidate.split('.').at(-1)}`;

      return { buffer, type };
    } catch (e) {
      if (process.env.NODE_ENV === 'dev') {
        console.log(e);
      }
      throw StaticException.FileNotFound();
    }
  }
}
