import {
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto);
      return await this.generateToken(user);
    } catch (error) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registration(userDto: CreateUserDto, session: ClientSession) {
    let candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser(
      { ...userDto, password: hashPassword },
      session,
    );

    return this.generateToken(user);
  }

  async getUserFromToken(res: Response): Promise<User | null> {
    const authHeader = res.req.headers.authorization;
    const token = authHeader.split(' ')[1];

    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(user: User) {
    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
      template: user.template,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Wrong email or password' });
  }
}
