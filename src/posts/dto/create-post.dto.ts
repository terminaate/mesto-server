import { IsBase64, IsMongoId, IsString, MaxLength } from 'class-validator';
import { MAX_POST_CONTENT_LENGTH } from '../models/post.model';

export class CreatePostDTO {
  @IsString()
  @IsMongoId()
  public userId: string;

  @IsString()
  @MaxLength(MAX_POST_CONTENT_LENGTH)
  public content: string;

  @IsString()
  @IsBase64()
  public image: string;
}
