import { Prop } from '@nestjs/mongoose';
import { Document, Types, Schema, SchemaTypes } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

export class Post extends Document {
  @ApiProperty({ example: 'title', description: 'title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'content', description: 'content' })
  @Prop({ required: false })
  content: string;

  @ApiProperty({ example: 'image', description: 'image' })
  @Prop({ required: true })
  image: string;
}

export const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

PostSchema.pre('findOne', function() {
  this.populate('user');
});

PostSchema.pre('findById', function() {
  this.populate('user');
});

PostSchema.pre('find', function() {
  this.populate('user');
});
