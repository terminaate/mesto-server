import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class PatchPostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export default PatchPostDto;
