import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class PatchUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  login?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  password?: string;
}

export default PatchUserDto;
