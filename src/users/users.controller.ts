import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { PatchUserDTO } from './dto/patch-user.dto';
import { Roles } from '../roles/roles.decorator';
import { PostsService } from '../posts/posts.service';
import { UserDTO } from './dto/user.dto';
import PostDto from '../posts/dto/post.dto';
import { UserRequest } from '../types/UserRequest';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Get('search')
  public async searchUsers(@Query('username') username: string): Promise<UserDTO[]> {
    if (!username) {
      return [];
    }
    return this.usersService.findUsersByFilter({
      username: new RegExp(username, 'i'),
    });
  }

  @Get('/:id')
  public async getUserById(@Req() req: UserRequest, @Param('id') id: string): Promise<UserDTO> {
    return this.usersService.getUserByIdent(id === '@me' ? req.user.id : id, id === '@me');
  }

  @Patch('/@me')
  @HttpCode(HttpStatus.ACCEPTED)
  public async patchSelfUser(@Req() req: UserRequest, @Body() userDto: PatchUserDTO): Promise<UserDTO> {
    return this.usersService.patchUser(req.user.id, userDto);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  public async patchUser(@Param('id') id: string, @Body() userDto: PatchUserDTO): Promise<UserDTO> {
    return this.usersService.patchUser(id, userDto);
  }

  @Delete('/@me')
  public async deleteSelfUser(@Req() req: UserRequest): Promise<UserDTO> {
    return this.usersService.deleteUser(req.user.id);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  public async deleteUser(@Param('id') id: string): Promise<UserDTO> {
    return this.usersService.deleteUser(id);
  }

  @Get('/:id/posts')
  public async getUserPosts(@Req() req: UserRequest, @Param('id') id: string): Promise<PostDto[]> {
    const userId = (await this.usersService.getUserByIdent(id === '@me' ? req.user.id : id, false)).id;
    return this.postsService.findUserPosts(id === '@me' ? req.user.id : userId);
  }
}
