import { IsOptional, IsString } from 'class-validator';

export class UpdateTemplateDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  companyName: string;

  @IsString()
  @IsOptional()
  companyImage: string;

  @IsString()
  @IsOptional()
  bill: string;

  @IsString()
  @IsOptional()
  billOwnerName: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  town: string;

  @IsString()
  @IsOptional()
  postCode: string;
}
