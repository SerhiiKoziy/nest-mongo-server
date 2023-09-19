import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Detail extends Document {
  @ApiProperty({ example: 'Name', description: 'Name' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 'Detail 1', description: 'Detail' })
  @Prop({ required: true, unique: true })
  detail: string;
}

export const DetailSchema = SchemaFactory.createForClass(Detail);
