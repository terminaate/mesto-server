import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostDTO } from './dto/post.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('/')
  public async createPost(@Body() createPostDTO: CreatePostDTO): Promise<PostDTO> {
    return this.postsService.createPost(createPostDTO);
  }
}
