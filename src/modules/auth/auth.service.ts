import {
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CreateUserDto } from "../user/dto/createUser.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import { LoginDto } from "./dto/login.dto";
import {ForgotPasswordDto} from './dto/forgotPassword.dto';
import nodemailer from 'nodemailer';
import process from 'process';
import fs from 'fs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto);
      return await this.generateToken(user);

    } catch (error) {
      throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST);
    }
  }

  async registration(userDto: CreateUserDto, session: ClientSession) {
    let candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({ ...userDto, password: hashPassword }, session)

    return this.generateToken(user)
  }

  async forgotPassword(dto: ForgotPasswordDto){
    try {
      const user = await this.userService.getUserByEmail(dto.email)
      if (!user) {
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
      }

      const verificationCode = await this.generateCode(6)
      user.password = verificationCode
      const newToken = await this.userService.updateUser(user)

      await this.sendVerificationCodeEmail(dto.email, verificationCode);
      return  await this.generateToken(newToken)
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generateToken(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    const passwordEquals = await bcrypt.compare(loginDto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: "Wrong email or password" })
  }

  private async generateCode(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }

  private async sendVerificationCodeEmail(email: string, verificationCode: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new HttpException('Failed to send verification code email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
