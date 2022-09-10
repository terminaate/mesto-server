import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import PostDto from './dto/post.dto';
import { InjectModel } from '@nestjs/mongoose';
import Post, { PostDocument } from './posts.model';
import { Model } from 'mongoose';
import CreatePostDto from './dto/create-post.dto';
import PatchPostDto from './dto/patch-post.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';
import { UserDocument } from '../users/models/users.model';
import FilesService from '../files/files.service';
import UsersService from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<PostDocument>,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {}

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
    { title, description, image }: PatchPostDto,
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

    const updatedFields: PatchPostDto = {};
    const newFields = { title, description };

    for (let i in newFields) {
      if (newFields[i] && post[i] !== newFields[i]) {
        updatedFields[i] = newFields[i];
      }
    }

    await post.updateOne(updatedFields);
    return { ...new PostDto(post), ...updatedFields };
  }

  async findPostById(id: string) {
    if (!id) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = this.postsModel.findById(id);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
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

    await post.deleteOne();
    return new PostDto(post);
  }

  async likePost(postId: string, userId: string) {
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => String(id) !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return new PostDto(post);
  }
}
