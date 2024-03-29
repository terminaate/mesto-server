import { IsNotEmpty, IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}

export default CreatePostDto;
