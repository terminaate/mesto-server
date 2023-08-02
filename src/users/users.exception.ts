import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class UsersException {
  public static UserNotExist(): CustomHttpException {
    return new CustomHttpException("Can't find a user with this data.", HttpStatus.BAD_REQUEST);
  }

  public static UserAlreadyExist(): CustomHttpException {
    return new CustomHttpException('User with this email or login already exist.', HttpStatus.BAD_REQUEST);
  }

  public static UserIdNotExist(): CustomHttpException {
    return new CustomHttpException('User with this id not exist.', HttpStatus.BAD_REQUEST);
  }
}
