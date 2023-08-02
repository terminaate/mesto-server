import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
  @Prop({ type: String, required: true })
  public value: string;
}

export type RoleDocument = Role & Document;

export const RoleSchema = SchemaFactory.createForClass(Role);
