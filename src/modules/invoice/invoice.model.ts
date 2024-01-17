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
  @Prop({ required: true, })
  recipientEmail: string;

  @ApiProperty({ example: 'productName: Item, count: 1 price: 100', description: 'Products' })
  @Prop({ required: true, })
  details: [];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

