import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class RolesException {
  public static RoleValueEmpty() {
    return new CustomHttpException("Can't find value in body.", HttpStatus.BAD_REQUEST);
  }

  public static RoleAlreadyExit() {
    return new CustomHttpException('Role with this value already exist.', HttpStatus.BAD_REQUEST);
  }
}
