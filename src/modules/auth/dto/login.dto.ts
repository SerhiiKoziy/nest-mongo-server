import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '123', description: 'Password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
