import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Template extends Document {
  @ApiProperty({ example: 'Ricardo', description: 'First name' })
  @Prop()
  firstName: string;

  @ApiProperty({ example: 'Daniel', description: 'Last name' })
  @Prop()
  lastName: string;

  @ApiProperty({ example: 'Example.co', description: 'Company name' })
  @Prop()
  companyName: string;

  @ApiProperty({ example: 'image', description: 'Company image' })
  @Prop()
  companyImage: string;

  // @ApiProperty({ example: '89a8f3b2246071a4b8b21f69', description: 'User ID' })
  // @Prop()
  // userId: string;

  @ApiProperty({ example: '2121313234', description: 'Bill' })
  @Prop()
  bill: string;

  @ApiProperty({ example: 'Bill Name', description: 'Bill Name' })
  @Prop()
  billOwnerName: string;

  @ApiProperty({ example: 'USA', description: 'country' })
  @Prop()
  country: string;

  @ApiProperty({ example: 'New York', description: 'Town' })
  @Prop()
  town: string;

  @ApiProperty({ example: '203390', description: 'Post code' })
  @Prop()
  postCode: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
