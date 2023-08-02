import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  public userId: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User', required: true }],
    required: true,
    default: [],
  })
  public likes: string[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Comment', required: true }],
    required: true,
    default: [],
  })
  public comments: string[];
}

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
