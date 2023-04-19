import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from "./user.model";
import { GetQueryDto } from "../../dto/getQueryDto";
import {RolesService} from "../roles/roles.service";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private rolesService: RolesService) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession) {
        const createdUser = await this.userRepository.createUser(createUserDto, session);
        const role = await this.rolesService.getRoleByValue("USER");
        console.log('role', role)
        await createdUser.$set('roles', [role.id])
        console.log('createdUser', createdUser)

        return createdUser;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId): Promise<User> {
        return await this.userRepository.getUserById(id);
    }

    async getUsers(getQueryDto: GetQueryDto): Promise<User[]> {
        return await this.userRepository.getUsers(getQueryDto);
    }
}
