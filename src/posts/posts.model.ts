import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User', required: true }], required: true, default: [] })
  likes: string[];
}

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);

export default Post;
