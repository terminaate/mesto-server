import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class UserToken {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  accessToken: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;
}

export type UserTokenDocument = UserToken & Document;

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);

export default UserToken;
