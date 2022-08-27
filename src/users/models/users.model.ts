import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class User {
  @Prop({ type: String })
  email?: string;

  @Prop({ type: String, required: true, unique: true })
  login: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, required: true, ref: 'Role' }], required: true })
  roles: string[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

export default User;
