import { IsNotEmpty, IsString } from 'class-validator';

class LikeCommentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  commentId: string;
}

export default LikeCommentDto;
