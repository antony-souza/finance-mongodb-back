import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/models/permissions/entities/permission.entity';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async createPermission(permissions: Permission): Promise<Permission> {
    return await this.permissionModel.create(permissions);
  }

  async getAllPermissions() {
    return await this.permissionModel.find();
  }
}
