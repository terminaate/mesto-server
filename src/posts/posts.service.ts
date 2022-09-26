import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import PostDto from './dto/post.dto';
import Post from './posts.model';
import CreatePostDto from './dto/create-post.dto';
import PatchPostDto from './dto/patch-post.dto';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';
import FilesService from '../files/files.service';
import UsersService from '../users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import User from '../users/models/users.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postsModel: typeof Post,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {
  }

  private validateUserPermissions(post: Post, user: User) {
    if (post.userId !== user.id && user.roles.some(role => role.get('value') === "ADMIN")) {
      throw new ForbiddenException();
    }
  }

  public async createPost(postDto: CreatePostDto) {
    if (!(await this.usersService.findUserByFilter({ where: { id: postDto.userId } }))) {
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

  public async patchPost(postId: string, { title, description, image }: PatchPostDto, user: User) {
    const post = await this.postsModel.findByPk(postId);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateUserPermissions(post, user)

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

    await post.update(updatedFields);
    return { ...new PostDto(post), ...updatedFields };
  }

  async findPostById(id: string) {
    if (!id) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = this.postsModel.findByPk(id);
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
    return (await this.postsModel.findAll({ where: { userId } }))
      .map((post) => new PostDto(post))
      .reverse();
  }

  async deletePost(postId: string, user: User) {
    const post = await this.postsModel.findByPk(postId);
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateUserPermissions(post, user)

    await post.destroy();
    return new PostDto(post);
  }

  async likePost(postId: string, userId: string) {
    const post = await this.postsModel.findByPk(postId);
    const user = await this.usersService.findUserByFilter({id: userId})
    if (!post) {
      throw new CustomHttpException(
        ApiExceptions.PostNotExist(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (post.likes.some(user => user.get("id") === userId)) {
      post.likes = post.likes.filter((id) => String(id) !== userId);
    } else {
      post.likes.push(user);
    }
    await post.save();
    return new PostDto(post);
  }
}
