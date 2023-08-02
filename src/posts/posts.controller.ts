import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PatchPostDTO } from './dto/patch-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../types/UserRequest';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostDTO } from './dto/post.dto';
import { CommentDTO } from './dto/comment.dto';
import { Comment } from './models/comments.model';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  public async createNewPost(@Body() postDto: CreatePostDTO): Promise<PostDTO> {
    return this.postsService.createPost(postDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('/:id')
  public async patchPost(@Req() { user }: UserRequest, @Param('id') id: string, @Body() postDto: PatchPostDTO): Promise<PostDTO> {
    return this.postsService.patchPost(id, postDto, user);
  }

  @Get('/:id')
  public async getPost(@Param('id') id: string): Promise<PostDTO> {
    return this.postsService.findPostById(id);
  }

  @Delete('/:id')
  public async deletePost(@Req() { user }: UserRequest, @Param('id') id: string): Promise<PostDTO> {
    return this.postsService.deletePost(id, user);
  }

  @Post('/:id/like')
  public async likePost(@Req() { user }: UserRequest, @Param('id') id: string): Promise<PostDTO> {
    return this.postsService.likePost(id, user.id);
  }

  @Post('/:id/comment')
  public async postComment(@Req() { user }: UserRequest, @Param('id') postId: string, @Body('content') content: string): Promise<CommentDTO> {
    return this.postsService.createPostComment({
      postId,
      userId: user.id,
      content,
    });
  }

  @Post('/:id/comments')
  public async getPostComments(@Param('id') postId: string): Promise<CommentDTO[]> {
    return this.postsService.getPostComments(postId);
  }

  @Post('/comment/:id/like')
  public async likeComment(@Req() { user }: UserRequest, @Param('id') commentId: string): Promise<CommentDTO> {
    return this.postsService.likePostComment({
      userId: user.id,
      commentId,
    });
  }

  @Post('/comment/:id')
  public async getComment(@Param('id') commentId: string): Promise<Comment> {
    return this.postsService.getComment(commentId);
  }
}
