import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  public userId: string;

  @Prop({ type: String, required: true })
  public content: string;
}

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);

export const MAX_POST_CONTENT_LENGTH = 500;
