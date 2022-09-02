import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import UsersService from './users.service';
import JwtAuthGuard, { UserRequest } from '../auth/guards/jwt-auth.guard';
import RolesGuard from '../roles/roles.guard';
import PatchUserDto from './dto/patch-user.dto';
import Roles from '../roles/roles.decorator';
import { PostsService } from '../posts/posts.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
class UsersController {

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {
  }

  @Get('search')
  async searchUsers(@Query('username') username: string) {
    if (!username) {
      return [];
    }
    return this.usersService.findUsersByFilter({ username: new RegExp(username, 'i') });
  }

  @Get('/:id')
  async getUserById(@Req() req: UserRequest, @Param('id') id: string) {
    return this.usersService.getUserByIdent(id === '@me' ? req.user.id : id, id === '@me');
  }

  @Patch('/@me')
  @HttpCode(HttpStatus.ACCEPTED)
  async patchSelfUser(@Req() req: UserRequest, @Body() userDto: PatchUserDto) {
    return this.usersService.patchUser(req.user.id, userDto);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async patchUser(@Param('id') id: string, @Body() userDto: PatchUserDto) {
    return this.usersService.patchUser(id, userDto);
  }


  @Delete('/@me')
  async deleteSelfUser(@Req() req: UserRequest) {
    return this.usersService.deleteUser(req.user.id);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('/:id/posts')
  async getUserPosts(@Req() req: UserRequest, @Param('id') id: string) {
    const userId = (await this.usersService.getUserByIdent(id === '@me' ? req.user.id : id, false)).id;
    return this.postsService.findUserPosts(id === '@me' ? req.user.id : userId);
  }
}

export default UsersController;
