import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Detail extends Document {
  @ApiProperty({ example: 'Water', description: 'Product Name' })
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ example: 'Serhii', description: 'User Name' })
  @Prop({ required: true })
  userName: string;

  @ApiProperty({ example: '25', description: 'Price first' })
  @Prop({ required: true, })
  price1: string;

  @ApiProperty({ example: '59', description: 'Price second' })
  @Prop({ required: true, })
  price2: string;

  @ApiProperty({ example: '1', description: 'Detail ID' })
  @Prop({ required: true, unique: true })
  detailID: string;

  @ApiProperty({ example: 'name: Item, price: 100', description: 'Products' })
  @Prop({ required: true, })
  productDetails: [];
}

export const DetailSchema = SchemaFactory.createForClass(Detail);

