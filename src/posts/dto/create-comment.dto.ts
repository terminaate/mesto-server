import { IsNotEmpty, IsString } from 'class-validator';

class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export default CreateCommentDto;
