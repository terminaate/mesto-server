import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
class FilesService {
  private readonly rootPath: string = path.resolve(__dirname, '../');

  constructor() {
    this.createStaticFolder();
  }

  private isStaticFolderExist() {
    try {
      return Boolean(fs.readdirSync(this.rootPath + '/static'));
    } catch (e) {
      return false;
    }
  }

  private createStaticFolder() {
    if (!this.isStaticFolderExist()) {
      fs.mkdir(this.rootPath + '/static', () => {
      });
    }
  }

  createNewUserFolder(userId: string) {
    const userPath = this.rootPath + `/static/${userId}`;
    fs.mkdir(userPath, () => {
    });
  }

  private static bytesToSize(bytes: number) {
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];

    if (bytes === 0) {
      return 'n/a';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    if (i === 0) {
      return { [sizes[i]]: bytes };
    }

    return { [sizes[i]]: (bytes / Math.pow(1024, i)).toFixed(1) };
  }

  getFileExt(imageBase: string) {
    return imageBase.substring('data:'.length, imageBase.indexOf(';base64'));
  }

  private static decodeBase64(dataString: string) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }

    const response: { data: Buffer, type: string } = {} as { data: Buffer, type: string };

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
  }

  public getFileSize(imageBase: string) {
    const base64str = imageBase.substring(imageBase.indexOf(',') + 1);
    const decoded = atob(base64str);

    return FilesService.bytesToSize(decoded.length);
  }

  public writeUserAvatar(userId: string, imageBase: string) {
    this.createNewUserFolder(userId);

    const fileExt = this.getFileExt(imageBase).split('/');
    if (fileExt[0] !== 'image') {
      return;
    }
    const decodedImage = FilesService.decodeBase64(imageBase);

    fs.readdir(this.rootPath + `/static/${userId}`, (_, data) => {
      if (data.some(v => v.includes('avatar') && v !== `avatar.${fileExt[1]}`)) {
        fs.rm(this.rootPath + `/static/${userId}/${data.find(v => v.includes('avatar'))}`, () => {
        });
      }
    });

    fs.writeFile(this.rootPath + `/static/${userId}/avatar.${fileExt[1]}`, decodedImage.data, () => {
    });
  }

  public isStringBase64(imageBase: string) {
    return Boolean(FilesService.decodeBase64(imageBase));
  }
}

export default FilesService;