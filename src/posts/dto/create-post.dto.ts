import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}

export default CreatePostDto;
