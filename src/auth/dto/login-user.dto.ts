import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class LoginUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  login?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export default LoginUserDto;
