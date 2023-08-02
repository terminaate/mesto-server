import { CustomHttpException } from '../exceptions/custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class PostsException {
  public static PostAlreadyExist(): CustomHttpException {
    return new CustomHttpException('Post already exist.', HttpStatus.BAD_REQUEST);
  }

  public static PostNotExist(): CustomHttpException {
    return new CustomHttpException('Post not founded.', HttpStatus.NOT_FOUND);
  }

  public static CommentNotExist(): CustomHttpException {
    return new CustomHttpException('Comment not founded.', HttpStatus.NOT_FOUND);
  }

  public static PostAlreadyLiked(): CustomHttpException {
    return new CustomHttpException('Post already liked.', HttpStatus.BAD_REQUEST);
  }
}
