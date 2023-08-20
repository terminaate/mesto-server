import { Injectable } from '@nestjs/common';
import { PostDocument } from './models/post.model';
import { FilesService } from '../files/files.service';
import { PostsException } from './posts.exception';
import { CreatePostDTO } from './dto/create-post.dto';
import { UsersRepository } from '../users/users.repository';
import { UsersException } from '../users/users.exception';
import { PostsRepository } from './posts.repository';
import { PostDTO } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    private filesService: FilesService,
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  public async createPost(postDto: CreatePostDTO): Promise<PostDTO> {
    if (!(await this.usersRepository.findUserById(postDto.userId))) {
      throw UsersException.UserNotExist();
    }

    this.filesService.validateImage(postDto.image);

    const { image, ...newPostDto } = postDto;
    const newPost = await this.postsRepository.createPost(newPostDto);

    this.filesService.createNewUserFolder(postDto.userId, '/posts');
    this.filesService.writePostImage(postDto.image, postDto.userId, newPost.id);

    return new PostDTO(newPost);
  }

  private async isPostExist(postId: string): Promise<PostDocument> {
    if (!postId) {
      throw PostsException.PostNotExist();
    }

    const post = await this.postsRepository.findPostById(postId);
    if (!post) {
      throw PostsException.PostNotExist();
    }

    return post;
  }

  // public async patchPost(postId: string, { image }: PatchPostDTO, user: UserDocument): Promise<PostDTO> {
  //   const post = await this.postsModel.findById(postId);
  //   if (!post) {
  //     throw PostsException.PostNotExist();
  //   }
  //
  //   if (post.userId !== user.id && !user.roles.includes('ADMIN')) {
  //     throw new ForbiddenException();
  //   }
  //
  //   if (image) {
  //     const isPostImageValid = this.filesService.validateImage(image);
  //     if (isPostImageValid) {
  //       this.filesService.writePostImage(image, post.userId, post.id);
  //     }
  //   }
  //
  //   return new PostDTO(post);
  // }
  //
  // public async findPostById(id: string): Promise<PostDTO> {
  //   const post = await this.isPostExist(id);
  //   return new PostDTO(post);
  // }
  //
  // public async findUserPosts(userId: string): Promise<PostDTO[]> {
  //   if (!userId) {
  //     throw UsersException.UserNotExist();
  //   }
  //   return (await this.postsModel.find({ userId })).map((post) => new PostDTO(post)).reverse();
  // }
  //
  // public async deletePost(postId: string, user: UserDocument): Promise<PostDTO> {
  //   const post = await this.isPostExist(postId);
  //
  //   if (post.userId !== user.id && !user.roles.includes('ADMIN')) {
  //     throw new ForbiddenException();
  //   }
  //
  //   await post.deleteOne();
  //   return new PostDTO(post);
  // }
  //
  // public async likePost(postId: string, userId: string): Promise<PostDTO> {
  //   const post = await this.isPostExist(postId);
  //   await this.likeObject(post, userId);
  //   return new PostDTO(post);
  // }
  //
  // public async createPostComment({ postId, userId, content }: CreateCommentDTO): Promise<CommentDTO> {
  //   const post = await this.isPostExist(postId);
  //   const newComment = await this.commentsModel.create({
  //     userId,
  //     content,
  //     postId,
  //   });
  //   post.comments.push(newComment.id);
  //   await post.save();
  //   return new CommentDTO(newComment);
  // }
  //
  // public async likePostComment({ userId, commentId }: LikeCommentDTO): Promise<CommentDTO> {
  //   const comment = await this.isCommentExist(commentId);
  //   await this.likeObject(comment, userId);
  //   return new CommentDTO(comment);
  // }
  //
  // public async getComment(commentId: string): Promise<CommentDocument> {
  //   return this.isCommentExist(commentId);
  // }

  // async getUserComments(userId: string) {
  //   if (!userId) {
  //     throw new CustomHttpException(
  //       UsersExceptions.UserIdNotExist(),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return (await this.commentsModel.find({ userId }))
  //     .map((comment) => new CommentDTO(comment))
  //     .reverse();
  // }

  // public async getPostComments(postId: string): Promise<CommentDTO[]> {
  //   if (!postId) {
  //     throw PostsException.PostNotExist();
  //   }
  //   return (await this.commentsModel.find({ postId })).map((comment) => new CommentDTO(comment)).reverse();
  // }
}
