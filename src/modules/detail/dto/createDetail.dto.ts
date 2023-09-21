import {IsString} from 'class-validator';

export class CreateDetailDto {
  @IsString()
  userName: string;
  @IsString()
  price1: string;
  @IsString()
  price2: string;
  @IsString()
  detailID: string;
  @IsString()
  productName: string;
}
