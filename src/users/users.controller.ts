import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import UsersService from './users.service';
import JwtAuthGuard, { UserRequest } from '../auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
class UsersController {

  constructor(
    private usersService: UsersService,
  ) {
  }

  @Get('/:id')
  async getUserById(@Req() req: UserRequest, @Param('id') id) {
    console.log(req.user);
    return this.usersService.getUserByIdent(id === '@me' ? req.user.id : id);
  }
}

export default UsersController;
