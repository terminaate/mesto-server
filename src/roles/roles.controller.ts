import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { RoleDocument } from './models/roles.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  public async newRole(@Body() createRoleDto: CreateRoleDTO): Promise<RoleDocument> {
    return this.rolesService.createRole(createRoleDto);
  }
}
