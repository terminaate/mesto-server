import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import RolesGuard from './roles.guard';
import Roles from './roles.decorator';
import RolesService from './roles.service';
import CreateRoleDto from './dto/create-role.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
class RolesController {

  constructor(
    private rolesService: RolesService,
  ) {
  }


  @Roles('ADMIN')
  @Post('/')
  async newRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }
}

export default RolesController;