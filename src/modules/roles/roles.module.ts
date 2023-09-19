import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./roles.model";
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from "./roles.repository";

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService, RoleRepository],
})
export class RolesModule {}
