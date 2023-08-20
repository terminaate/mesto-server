import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserToken {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  public userId: string;

  @Prop({ type: String, required: true, unique: true })
  public accessToken: string;

  @Prop({ type: String, required: true, unique: true })
  public refreshToken: string;
}

export type UserTokenDocument = UserToken & Document;

export type Tokens = Omit<UserToken, 'userId'>;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
