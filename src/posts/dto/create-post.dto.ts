import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsNotEmpty()
  @IsString()
  public image: string;
}
