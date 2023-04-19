import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { User } from "../entities/user.entity";

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true, unique: true })
  description: string;

  // @BelongsToMany(() => User, () => UserRoles)
  // users: User[];
  // users: [{ type: Types.ObjectId, ref: 'User' }];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
