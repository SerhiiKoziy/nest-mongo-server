import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AdditionalDetails {
  @IsString()
  productName: string;

  @IsString()
  count: string;

  @IsString()
  price: string;
}

export class CreateDetailDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  recipientEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalDetails)
  details: AdditionalDetails[];
}
