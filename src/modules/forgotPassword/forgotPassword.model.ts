import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class ForgotPassword extends Document {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'AVG6DS', description: 'Verification Code' })
  @Prop({ required: true })
  verificationCode: string;

  @ApiProperty({ example: '2023-04-17T15:46:20.947Z', description: 'createdAt' })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword);
