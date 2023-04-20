import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import {Role} from "../roles/roles.model";

@Schema()
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
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.post('save', async function() {
//     await this.populate({ path: 'roles' });
// })
//
// UserSchema.pre('find', async function() {
//     await this.populate({ path: 'roles' });
// })
