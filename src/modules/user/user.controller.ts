import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { GetQueryDto } from "../../dto/getQueryDto";
import { User } from "./user.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userService: UserService) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, type: User })
    @Post('/createUser')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newUser: any = await this.userService.createUser(createUserDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.CREATED).send(newUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, type: User })
    @Get('/getUserById/:id')
    async getUserById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const user: any = await this.userService.getUserById(id);

        return res.status(HttpStatus.OK).send(user);
    }


    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/all')
    async getUsers(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const users: any = await this.userService.getUsers(getQueryDto);

        return res.status(HttpStatus.OK).send(users);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/getAllUsers')
    async getAllUsers(@Res() res: any) {
        const users: any = await this.userService.getAllUsers();

        return res.status(HttpStatus.OK).send(users);
    }
}
