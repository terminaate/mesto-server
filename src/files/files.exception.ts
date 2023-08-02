import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class FilesException {
  public static FileNotBase64() {
    return new CustomHttpException('File is not base64.', HttpStatus.BAD_REQUEST);
  }

  public static TooLargeFileSize() {
    return new CustomHttpException('Too large file size. (max size is 5mb)', HttpStatus.BAD_REQUEST);
  }

  public static FileNotFound() {
    return new CustomHttpException('File not found.', HttpStatus.BAD_REQUEST);
  }
}
