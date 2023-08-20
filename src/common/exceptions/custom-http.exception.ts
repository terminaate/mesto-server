import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string | string[], statusCode: number) {
    super(
      {
        statusCode,
        message: Array.isArray(message) ? [...message] : [message],
      },
      statusCode,
    );
  }

  public static UnauthorizedException(): CustomHttpException {
    return new CustomHttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
  }

  public static ForbiddenException(): CustomHttpException {
    return new CustomHttpException('Forbidden.', HttpStatus.FORBIDDEN);
  }

  public static InternalServerError(): CustomHttpException {
    return new CustomHttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}