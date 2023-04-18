import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from "../../entities/user.entity";
import { GetQueryDto } from "../../dto/getQueryDto";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession) {
        const createdUser = await this.userRepository.createUser(createUserDto, session);

        return createdUser;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId): Promise<User> {
        return await this.userRepository.getUserById(id);
    }

    async getUsers(getQueryDto: GetQueryDto): Promise<User[]> {
        return await this.userRepository.getUsers(getQueryDto);
    }
}
