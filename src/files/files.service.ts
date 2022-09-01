import { HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import CustomHttpException from 'src/exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';


@Injectable()
class FilesService {
  private readonly rootPath: string = path.resolve(__dirname, '../') + '/static';

  constructor() {
    this.createStaticFolder();
  }

  private isStaticFolderExist() {
    try {
      return Boolean(fs.readdirSync(this.rootPath));
    } catch (e) {
      return false;
    }
  }

  private createStaticFolder() {
    if (!this.isStaticFolderExist()) {
      fs.mkdir(this.rootPath, () => {
      });
    }
  }

  public createNewUserFolder(userId: string, path = '') {
    const userPath = this.rootPath + `/${userId}${path}`;
    fs.mkdir(userPath, () => {
    });
  }

  private bytesToSize(bytes: number) {
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

  public getFileExt(imageBase: string) {
    return imageBase.substring('data:'.length, imageBase.indexOf(';base64'));
  }

  private decodeBase64(dataString: string) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }

    const response: { data: Buffer, type: string } = {} as { data: Buffer, type: string };

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
  }

  public writeFile(image: string, path: string, fileName: string) {
    const fileExt = this.getFileExt(image).split('/');
    const decodedImage = this.decodeBase64(image);
    const foundFile = this.findFileWithName(this.rootPath + path, fileName);

    if (foundFile && foundFile !== `${fileName}.${fileExt[1]}`) {
      fs.rm(this.rootPath + `${path}/${foundFile}`, () => {
      });
    }

    fs.writeFile(this.rootPath + `${path}/${fileName}.${fileExt[1]}`, decodedImage.data, () => {
    });
  }

  public getFileSize(imageBase: string) {
    const base64str = imageBase.substring(imageBase.indexOf(',') + 1);
    const decoded = atob(base64str);

    return this.bytesToSize(decoded.length);
  }

  public validateImage(image: string) {
    if (image === null) return null;

    const imageExt = this.getFileExt(image).split('/');
    const imageSize = this.getFileSize(image);
    const isImageBase64 = image && this.isStringBase64(image) || imageExt[0] === 'image';
    if (!isImageBase64) {
      throw new CustomHttpException(ApiExceptions.FileNotBase64(), HttpStatus.BAD_REQUEST);
    }
    const isImageSizeValid = imageSize !== 'n/a' && Object.keys(imageSize).includes('kb') || (Object.keys(imageSize).includes('mb') && (imageSize as Record<string, number>).mb < 5);
    if (!isImageSizeValid) {
      throw new CustomHttpException(ApiExceptions.TooLargeFileSize(), HttpStatus.BAD_REQUEST);
    }
    return imageExt;
  }

  private findFileWithName(path: string, fileName: string): string | false {
    try {
      return fs.readdirSync(path).find(file => file.includes(fileName));
    } catch (e) {
      return false;
    }
  }

  public writeUserAvatar(userId: string, imageBase: string) {
    this.writeFile(imageBase, `/${userId}`, 'avatar');
  }

  public isStringBase64(imageBase: string) {
    return Boolean(this.decodeBase64(imageBase));
  }

  public deleteFile(path: string, fileName: string) {
    try {
      const foundFile = this.findFileWithName(this.rootPath + path, fileName);
      fs.rmSync(this.rootPath + `${path}/${foundFile}`);
    } catch (e) {
      throw new CustomHttpException(ApiExceptions.FileNotFound(), HttpStatus.BAD_REQUEST);
    }
  }

  public deleteUserAvatar(userId: string) {
    this.deleteFile(`/${userId}`, 'avatar');
  }

  public deleteUserFolder(userId: string) {
    try {
      fs.rmdirSync(this.rootPath + `/${userId}`);
    } catch (e) {
      throw new CustomHttpException(ApiExceptions.UserIdNotExist(), HttpStatus.BAD_REQUEST);
    }
  }

  public writePostImage(image: string, userId: string, postId: string) {
    this.writeFile(image, `/${userId}/posts`, postId);
  }
}

export default FilesService;