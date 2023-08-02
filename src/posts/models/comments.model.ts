import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  public userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  public postId: string;

  @Prop({ type: String, required: true })
  public content: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User', required: true }],
    required: true,
    default: [],
  })
  public likes: string[];
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);
