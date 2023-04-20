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
        const role = await this.rolesService.getRoleByValue("USER");
        let user = { ...createUserDto, role: role._id };

        const createdUser = await this.userRepository.createUser(user, session);

        if (role) {
            await createdUser.set('role', role._id)
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
}
