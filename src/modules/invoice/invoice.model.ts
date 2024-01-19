import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Invoice extends Document {
  @ApiProperty({ example: 'Water', description: 'Product Name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Serhii', description: 'User Name' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 'serhii@gmail.com', description: 'Email' })
  @Prop({ required: true })
  recipientEmail: string;

  @ApiProperty({ example: 'productName: Item, count: 1, price: 100', description: 'Products' })
  @Prop({ required: true })
  details: [];

  @ApiProperty({ example: '89a8f3b2246071a4b8b21f69', description: 'User ID' })
  @Prop({ required: true })
  userId: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
