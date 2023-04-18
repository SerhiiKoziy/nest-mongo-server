import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class User extends Document {
    @ApiProperty({ example: 'Nick', description: 'Name' })
    @Prop({ required: true, unique: true })
    name: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty({ example: 'USER', description: 'role' })
    @Prop({ required: true, enum: ['ADMIN', 'USER'] })
    role: string;

    @ApiProperty({ example: '2023-04-17T15:46:20.947Z', description: 'createdAt' })
    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
