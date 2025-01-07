import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionEntity } from 'src/models/permissions/entities/permission.entity';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel('Permission')
    private readonly permissionModel: Model<PermissionEntity>,
  ) {}

  async createPermission(
    permissions: PermissionEntity,
  ): Promise<PermissionEntity> {
    return await this.permissionModel.create(permissions);
  }

  async getAllPermissions() {
    return await this.permissionModel.find();
  }
}
