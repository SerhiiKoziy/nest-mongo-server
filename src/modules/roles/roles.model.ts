import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true, unique: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
