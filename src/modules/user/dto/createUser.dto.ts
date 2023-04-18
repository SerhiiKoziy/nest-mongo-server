import { IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'Nick', description: 'Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'USER', description: 'Role' })
    @IsString()
    @IsNotEmpty()
    role: any;
}
