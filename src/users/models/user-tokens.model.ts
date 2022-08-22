import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class UserTokens {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  accessToken: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;
}

export type UserTokensDocument = UserTokens & Document;

export const UserTokensSchema = SchemaFactory.createForClass(UserTokens);

export default UserTokens;
