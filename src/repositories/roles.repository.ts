import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleEntity } from 'src/models/roles/entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<RoleEntity>,
  ) {}

  async createRoles(roles: RoleEntity): Promise<RoleEntity> {
    return await this.roleModel.create(roles);
  }
}
