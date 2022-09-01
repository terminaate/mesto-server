import { HttpException } from '@nestjs/common';

class CustomHttpException extends HttpException {
  constructor(message: string | string[], status: number) {
    super({ 'statusCode': status, message: Array.isArray(message) ? [...message] : [message] }, status);
  }
}

export default CustomHttpException;