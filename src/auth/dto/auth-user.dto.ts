import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

class AuthUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  bio?: string;

  @IsNotEmpty()
  password: string;
}

export default AuthUserDto;
