import { HttpException } from '@nestjs/common';

class CustomHttpException extends HttpException {
  constructor(message: string | string[], status: number) {
    const formatedMessage = Array.isArray(message) ? [...message] : [message];
    super({ 'statusCode': status, message: formatedMessage }, status);
  }
}

export default CustomHttpException;