import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class User {
  @Prop({ type: String, required: false })
  email?: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Array, required: true })
  roles: string[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

export default User;
