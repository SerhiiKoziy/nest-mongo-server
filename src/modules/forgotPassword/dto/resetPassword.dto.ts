import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: 'FGD34D', description: 'Verification code' })
  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
