import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PatchUserDTO } from './dto/patch-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserRequest } from '../common/types/UserRequest';
import { isSelfUser } from '../common/utils/isSelfUser';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  public async searchUsers(@Query('username') username: string): Promise<UserDTO[]> {
    return this.usersService.findUsersByUserName(username);
  }

  @Get('/:ident')
  public async getUserById(@Req() req: UserRequest, @Param('ident') ident: string): Promise<UserDTO> {
    if (isSelfUser(req.user, ident)) {
      return new UserDTO(req.user, true);
    } else {
      return this.usersService.getUserByIdent(ident);
    }
  }

  @Patch('/@me')
  public async patchUser(@Req() req: UserRequest, @Body() userDto: PatchUserDTO): Promise<UserDTO> {
    return this.usersService.patchUser(req.user.id, userDto);
  }

  @Delete('/@me')
  public async deleteUser(@Req() req: UserRequest): Promise<UserDTO> {
    return this.usersService.deleteUser(req.user.id);
  }

  // @Get('/:id/posts')
  // @HttpCode(HttpStatus.OK)
  // public async getUserPosts(@Req() req: UserRequest, @Param('id') id: string): Promise<PostDTO[]> {
  //   let userId;
  //   if (id === '@me') {
  //     userId = req.user.id;
  //   } else {
  //     userId = id;
  //   }
  //
  //   return this.postsService.findUserPosts(userId);
  // }
}
