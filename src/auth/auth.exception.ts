import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthException {
  public static WrongAuthData(): CustomHttpException {
    return new CustomHttpException('Wrong email or login or password.', HttpStatus.BAD_REQUEST);
  }
}
