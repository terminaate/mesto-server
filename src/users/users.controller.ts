import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import UsersService from './users.service';
import JwtAuthGuard, { UserRequest } from '../auth/guards/jwt-auth.guard';
import RolesGuard from '../roles/roles.guard';
import PatchUserDto from './dto/patch-user.dto';
import Roles from '../roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
class UsersController {

  constructor(
    private usersService: UsersService,
  ) {
  }

  @Get('/:id')
  async getUserById(@Req() req: UserRequest, @Param('id') id: string) {
    return this.usersService.getUserByIdent(id === '@me' ? req.user.id : id, id === '@me');
  }

  @Patch('/@me')
  async patchSelfUser(@Req() req: UserRequest, @Body() userDto: PatchUserDto) {
    return this.usersService.patchUser(req.user.id, userDto);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  async patchUser(@Req() req: UserRequest, @Param('id') id: string, @Body() userDto: PatchUserDto) {
    return this.usersService.patchUser(id, userDto);
  }
}

export default UsersController;
