import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Nick', description: 'Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '123', description: 'Password' })
    @IsString()
    @IsNotEmpty()
    password: string;


    @ApiProperty({ example: 'ADMIN', description: 'Roles' })
    @IsString({each: true})
    role: string;
}
