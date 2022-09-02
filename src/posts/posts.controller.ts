import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import CreatePostDto from './dto/create-post.dto';
import PatchPostDto from './dto/patch-post.dto';
import JwtAuthGuard, { UserRequest } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {

  constructor(
    private postsService: PostsService,
  ) {
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createNewPost(@Body() postDto: CreatePostDto) {
    return this.postsService.createPost(postDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('/:id')
  async patchPost(@Req() { user }: UserRequest, @Param('id') id: string, @Body() postDto: PatchPostDto) {
    return this.postsService.patchPost(id, postDto, user);
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  @Delete('/:id')
  async deletePost(@Req() { user }: UserRequest, @Param('id') id: string) {
    return this.postsService.deletePost(id, user);
  }

  @Post('/:id/like')
  async likePost(@Req() { user }: UserRequest, @Param('id') id: string) {
    return this.postsService.likePost(id, user.id);
  }
}
