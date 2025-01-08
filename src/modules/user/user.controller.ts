import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UseGuards
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { GetQueryDto } from "../../dto/getQueryDto";
import { User } from "./user.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RoleGuard } from "../auth/roles.guard";
import { Role } from "../auth/roles-auth.decorator";
import { AddRoleDto } from "./dto/addRole.dto";
import { BanUserDto } from "./dto/banUser.dto";

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
    @UseGuards(JwtAuthGuard)
    @Get('/getUserById/:id')
    async getUserById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const user: any = await this.userService.getUserById(id);

        return res.status(HttpStatus.OK).send(user);
    }


    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @UseGuards(JwtAuthGuard)
    @Get('/getAllUsersWithQuery')
    async getUsersWithQuery(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const users: any = await this.userService.getUsersWithQuery(getQueryDto);

        return res.status(HttpStatus.OK).send(users);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @Role('ADMIN')
    @UseGuards(RoleGuard)
    @Get('/getAllUsers')
    async getAllUsers(@Res() res: any) {
        const users: any = await this.userService.getAllUsers();

        return res.status(HttpStatus.OK).send(users);
    }

    @ApiOperation({ summary: 'Give role for user' })
    @ApiResponse({ status: 200, type: User })
    @Role('ADMIN')
    @UseGuards(RoleGuard)
    @Post('/addRole')
    async addRole(@Body() dto: AddRoleDto, @Res() res: any) {
        const user: any = await this.userService.addRole(dto);

        return res.status(HttpStatus.OK).send(user);
    }

    @ApiOperation({ summary: 'Ban user' })
    @ApiResponse({ status: 200, type: User })
    @Role('ADMIN')
    @UseGuards(RoleGuard)
    @Post('/banUser')
    async banUser(@Body() dto: BanUserDto, @Res() res: any) {
        const users: any = await this.userService.banUser(dto);

        return res.status(HttpStatus.OK).send(users);
    }
}
