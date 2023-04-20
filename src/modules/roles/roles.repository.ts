import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/createRole.dto';

export class RoleRepository {
    constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) {}

    async createRole(createRoleDto: CreateRoleDto, session: ClientSession) {
        let roleProposal = await this.getRoleByValue(createRoleDto.value);

        if (roleProposal) {
            throw new ConflictException('Role already exists');
        }

        let role = new this.roleModel({
            value: createRoleDto.value,
            description: createRoleDto.description,
        });

        try {
            role = await role.save({ session });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!role) {
            throw new ConflictException('Role not created');
        }

        return role;
    }

    async getRoleByValue(value: string) {
        let role;
        try {
            role = await this.roleModel.findOne({ where: { value }});
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }
}
