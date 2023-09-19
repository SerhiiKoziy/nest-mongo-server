import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from "./dto/createRole.dto";
import { ClientSession } from "mongoose";
import { RoleRepository } from "./roles.repository";
import { Role } from "./roles.model";

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(createRoleDto: CreateRoleDto, session: ClientSession) {
    const createdRole = await this.roleRepository.createRole(createRoleDto, session);
    return createdRole;
  }

  async getRoleByValue(value: string): Promise<Role> {
    return await this.roleRepository.getRoleByValue(value);
  }

}
