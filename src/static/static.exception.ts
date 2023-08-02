import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class StaticException {
  public static FileNotFound(): CustomHttpException {
    return new CustomHttpException('File not found.', HttpStatus.NOT_FOUND);
  }
}
