import { IsNotEmpty, IsString } from 'class-validator';

export class LikeCommentDTO {
  @IsNotEmpty()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @IsString()
  public commentId: string;
}
