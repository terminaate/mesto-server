import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ type: String })
  public email?: string;

  @Prop({ type: String, required: true, unique: true })
  public login: string;

  @Prop({ type: String })
  public username: string;

  @Prop({ type: String })
  public bio?: string;

  @Prop({ type: String, required: true })
  public password: string;

  @Prop({
    type: [{ type: Types.ObjectId, required: true, ref: 'Role' }],
    required: true,
  })
  public roles: string[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
