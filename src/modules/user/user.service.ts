import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.model';
import { GetQueryDto } from '../../dto/getQueryDto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/addRole.dto';
import { BanUserDto } from './dto/banUser.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly userRepository: UserRepository, private rolesService: RolesService) {}

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    const role = await this.rolesService.getRoleByValue('USER');
    let user = { ...createUserDto, role: role._id };

    const createdUser = await this.userRepository.createUser(user, session);

    if (role) {
      await createdUser.set('role', role._id);
    }

    return createdUser;
  }

  async getUserById(id: MongooseSchema.Types.ObjectId): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async getUsersWithQuery(getQueryDto: GetQueryDto): Promise<User[]> {
    return await this.userRepository.getUsers(getQueryDto);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.getUserByEmail(email);
  }

  async getUserPrimaryKey(userId): Promise<User> {
    return await this.userRepository.getUserPrimaryKey(userId);
  }

  async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.getUserPrimaryKey(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      user.role = role.id;
      await user.save();

      return user;
    }

    throw new HttpException('User or password not found', HttpStatus.BAD_REQUEST);
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.getUserPrimaryKey(dto.userId);

    if (user) {
      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();

      return user;
    }

    throw new HttpException('User found', HttpStatus.BAD_REQUEST);
  }

  async updateUser(user: User): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(user._id, user, { new: true });
    } catch (error) {
      throw new Error('Failed to update user in the database');
    }
  }
}
