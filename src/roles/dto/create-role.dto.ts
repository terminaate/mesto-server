import { IsString } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  public value: string;
}
