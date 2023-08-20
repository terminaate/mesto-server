import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class FilesException {
  public static FileNotBase64(): CustomHttpException {
    return new CustomHttpException('StaticServiceFile is not base64.', HttpStatus.BAD_REQUEST);
  }

  public static TooLargeFileSize(): CustomHttpException {
    return new CustomHttpException('Too large file size. (max size is 5mb)', HttpStatus.BAD_REQUEST);
  }

  public static FileNotFound(): CustomHttpException {
    return new CustomHttpException('StaticServiceFile not found.', HttpStatus.BAD_REQUEST);
  }
}
