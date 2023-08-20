import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './models/post.model';
import { Model } from 'mongoose';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postsModel: Model<PostDocument>) {}

  public async findPostById(postId: string): Promise<PostDocument> {
    return this.postsModel.findById(postId);
  }

  public async createPost(post: Post): Promise<PostDocument> {
    return this.postsModel.create(post);
  }
}
