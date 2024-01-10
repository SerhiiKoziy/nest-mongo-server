import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty()
  email: string;
}
