import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../modules/user/dto/createUser.dto';
import {GetQueryDto} from "../dto/getQueryDto";

export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto, session: ClientSession) {
        let user = await this.getUserByEmail(createUserDto.email);

        if (user) {
            throw new ConflictException('User already exists');
        }

        user = new this.userModel({
            name: createUserDto.name,
            email: createUserDto.email,
            role: createUserDto.role,
        });

        try {
            user = await user.save({ session });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new ConflictException('User not created');
        }

        return user;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        let user;
        try {
            user = await this.userModel.findById({ _id: id });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getUserByEmail(email: string) {
        let user;
        try {
            user = await this.userModel.findOne({ email }, 'name email img role').exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return user;
    }

    async getUsers(query: GetQueryDto) {
        let from = query.from || 0;
        from = Number(from);

        let limit = query.limit || 0;
        limit = Number(limit);

        let users: User[];

        try {
            if (limit === 0) {
                users = await this.userModel
                  .find()
                  // .populate('client')
                  // .populate('user', 'name email')
                  .skip(from)
                  .sort({ createdAt: -1 })
                  .exec();
            } else {
                users = await this.userModel
                  .find()
                  // .populate('client')
                  // .populate('user', 'name email')
                  .skip(from)
                  .limit(limit)
                  .sort({ createdAt: -1 })
                  .exec();
            }

            let response;

            if (users.length > 0) {
                response = {
                    ok: true,
                    data: users,
                    message: 'Get Products Ok!',
                };
            } else {
                response = {
                    ok: true,
                    data: [],
                    message: 'No hay products',
                };
            }

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
