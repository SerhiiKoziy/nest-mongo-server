import {IsEmail, IsNotEmpty, IsString, Length} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Nick', description: 'Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @IsString({ message: 'Must be a string' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Not correct email' })
    email: string;

    @ApiProperty({ example: '123', description: 'Password' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 16, { message: 'More then 4 and less then 16' })
    password: string;


    @ApiProperty({ example: 'ADMIN', description: 'Roles' })
    @IsString({each: true})
    role: string;
}
