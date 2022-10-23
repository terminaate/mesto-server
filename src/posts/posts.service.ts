import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import PostDto from './dto/post.dto';
import { InjectModel } from '@nestjs/mongoose';
import Post, { PostDocument } from './models/posts.model';
import { Document, Model } from 'mongoose';
import CreatePostDto from './dto/create-post.dto';
import PatchPostDto from './dto/patch-post.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';
import { UserDocument } from '../users/models/users.model';
import FilesService from '../files/files.service';
import UsersService from '../users/users.service';
import Comment, { CommentDocument } from './models/comments.model';
import CreateCommentDto from './dto/create-comment.dto';
import CommentDto from './dto/comment.dto';
import LikeCommentDto from './dto/like-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentsModel: Model<CommentDocument>,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {}

  private async isPostExist(postId: string) {
    if (!postId) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return post;
  }

  // TODO
  // test this function
  private async likeObject(model: Document & any, userId: string) {
    if (model.likes.includes(userId)) {
      model.likes = model.likes.filter((id) => String(id) !== userId);
    } else {
      model.likes.push(userId);
    }
    await model.save();
  }

  private async isCommentExist(commentId: string) {
    if (!commentId) {
      throw new CustomHttpException(
        ApiExceptions.CommentNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const comment = await this.commentsModel.findById(commentId);
    if (!comment) {
      throw new CustomHttpException(
        ApiExceptions.CommentNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return comment;
  }

  public async createPost(postDto: CreatePostDto) {
    if (!(await this.usersService.findUserByFilter({ _id: postDto.userId }))) {
      throw new CustomHttpException(
        ApiExceptions.UserIdNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    this.filesService.validateImage(postDto.image);

    const { image, ...newPostDto } = postDto;
    const newPost = await this.postsModel.create(newPostDto);

    this.filesService.createNewUserFolder(postDto.userId, '/posts');
    this.filesService.writePostImage(postDto.image, postDto.userId, newPost.id);

    return new PostDto(newPost);
  }

  public async patchPost(
    postId: string,
    { image }: PatchPostDto,
    user: UserDocument,
  ) {
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (post.userId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException();
    }

    if (image) {
      const isPostImageValid = this.filesService.validateImage(image);
      if (isPostImageValid) {
        this.filesService.writePostImage(image, post.userId, post.id);
      }
    }

    return new PostDto(post);
  }

  async findPostById(id: string) {
    const post = await this.isPostExist(id);
    return new PostDto(post);
  }

  async findUserPosts(userId: string) {
    if (!userId) {
      throw new CustomHttpException(
        ApiExceptions.UserNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return (await this.postsModel.find({ userId }))
      .map((post) => new PostDto(post))
      .reverse();
  }

  async deletePost(postId: string, user: UserDocument) {
    const post = await this.isPostExist(postId);

    if (post.userId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException();
    }

    await post.deleteOne();
    return new PostDto(post);
  }

  async likePost(postId: string, userId: string) {
    const post = await this.isPostExist(postId);
    await this.likeObject(post, userId);
    return new PostDto(post);
  }

  async createPostComment({ postId, userId, content }: CreateCommentDto) {
    const post = await this.isPostExist(postId);
    const newComment = await this.commentsModel.create({
      userId,
      content,
      postId,
    });
    post.comments.push(newComment.id);
    await post.save();
    return new CommentDto(newComment);
  }

  async likePostComment({ userId, commentId }: LikeCommentDto) {
    const comment = await this.isCommentExist(commentId);
    await this.likeObject(comment, userId);
    return new CommentDto(comment);
  }

  async getComment(commentId: string) {
    return await this.isCommentExist(commentId);
  }

  // async getUserComments(userId: string) {
  //   if (!userId) {
  //     throw new CustomHttpException(
  //       ApiExceptions.UserIdNotExist(),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   return (await this.commentsModel.find({ userId }))
  //     .map((comment) => new CommentDto(comment))
  //     .reverse();
  // }

  async getPostComments(postId: string) {
    if (!postId) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    return (await this.commentsModel.find({ postId }))
      .map((comment) => new CommentDto(comment))
      .reverse();
  }
}
