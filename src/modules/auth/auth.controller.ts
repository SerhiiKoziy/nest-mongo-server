import { Controller, Post, Body, HttpStatus, BadRequestException, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { AuthService } from "./auth.service";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(@InjectConnection() private readonly mongoConnection: Connection, private authService: AuthService) {
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const loginToken: any = await this.authService.login(loginDto);

      return await res.status(HttpStatus.ACCEPTED).send(loginToken);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const registrationToken: any = await this.authService.registration(userDto, session);
      await session.commitTransaction();

      return await res.status(HttpStatus.CREATED).send(registrationToken);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }

  @ApiOperation({ summary: 'Forgot password' })
  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res: Response) {
    const email = await this.authService.forgotPassword(dto);

    return res.status(HttpStatus.OK).send(email)
  }
}
