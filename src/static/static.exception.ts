import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class StaticException {
  public static FileNotFound(): CustomHttpException {
    return new CustomHttpException('StaticServiceFile not found.', HttpStatus.NOT_FOUND);
  }
}
