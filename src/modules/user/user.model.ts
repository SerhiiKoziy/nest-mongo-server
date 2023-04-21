import { Prop } from '@nestjs/mongoose';
import { Document, Types, Schema, SchemaTypes } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import {Role} from "../roles/roles.model";

export class User extends Document {
    @ApiProperty({ example: 'Nick', description: 'Name' })
    @Prop({ required: true, unique: true })
    name: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty({ example: '2023-04-17T15:46:20.947Z', description: 'createdAt' })
    @Prop({ default: Date.now })
    createdAt: Date;

    @ApiProperty({ example: 'password', description: 'Password' })
    @Prop({ default: 'password' })
    password: string;

    @ApiProperty({ example: 'USER', description: 'USER' })
    @Prop({ default: 'USER' })
    role: Types.ObjectId;

    @ApiProperty({ example: 'false', description: 'banned' })
    @Prop({ default: false })
    banned: boolean;

    @ApiProperty({ example: 'Uncontrolled', description: 'banReason' })
    @Prop({ default: '' })
    banReason: string;
}


export const UserSchema: Schema = new Schema(
  {
      name: {
          type: String,
      },
      email: {
          type: String,
          required: true,
      },
      password: {
          type: String,
          required: true,
      },
      banned: {
          type: Boolean,
      },
      banReason: {
          type: String,
      },
      role: {
          type: SchemaTypes.ObjectId,
          ref: 'Role',
      },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

UserSchema.pre('findOne', function() {
  this.populate('role');
});

UserSchema.pre('findById', function() {
  this.populate('role');
});

UserSchema.pre('find', function() {
  this.populate('role');
});
