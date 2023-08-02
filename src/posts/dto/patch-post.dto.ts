import { IsOptional, IsString } from 'class-validator';

export class PatchPostDTO {
  @IsOptional()
  @IsString()
  public image?: string;
}
