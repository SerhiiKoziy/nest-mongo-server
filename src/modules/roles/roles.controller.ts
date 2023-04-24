import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { RolesService } from "./roles.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Role } from "./roles.model";
import { Response } from "express";
import { User } from "../user/user.model";
import { CreateRoleDto } from "./dto/createRole.dto";

@Controller('roles')
export class RolesController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 200, type: Role })
  @Post('/createRole')
  async createRole(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newRole: any = await this.rolesService.createRole(createRoleDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newRole);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @ApiOperation({ summary: 'Get role by value' })
  @ApiResponse({ status: 200, type: User })
  @Get('/getRoleByValue/:value')
  async getUserById(@Param('value') value: string, @Res() res: Response) {
    const user: any = await this.rolesService.getRoleByValue(value);

    return res.status(HttpStatus.OK).send(user);
  }
}
