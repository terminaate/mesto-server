import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PatchUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public login?: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public username?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  public bio?: string;

  @IsOptional()
  @IsString()
  public avatar?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  public password?: string;
}
