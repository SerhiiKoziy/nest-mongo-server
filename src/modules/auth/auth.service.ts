import { UnauthorizedException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CreateUserDto } from "../user/dto/createUser.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto)

    return this.generateToken(user)
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
}
