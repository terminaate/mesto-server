import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User', required: true }],
    required: true,
    default: [],
  })
  likes: string[];
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);

export default Comment;
