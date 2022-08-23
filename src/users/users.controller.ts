import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import UsersService from './users.service';
import JwtAuthGuard, { UserRequest } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
class UsersController {

  constructor(
    private usersService: UsersService,
  ) {
  }

  @Get('/:id')
  async getUserById(@Req() req: UserRequest, @Param('id') id) {
    return this.usersService.getUserByIdent(id === '@me' ? req.user.id : id);
  }
}

export default UsersController;
