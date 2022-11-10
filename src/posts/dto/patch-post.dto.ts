import { IsOptional, IsString } from 'class-validator';

class PatchPostDto {
  @IsOptional()
  @IsString()
  image?: string;
}

export default PatchPostDto;
