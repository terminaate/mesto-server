import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public login: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsNotEmpty()
  @MinLength(7)
  public password: string;
}
