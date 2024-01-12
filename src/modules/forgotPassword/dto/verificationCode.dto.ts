import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationCodeDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123', description: 'Code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
