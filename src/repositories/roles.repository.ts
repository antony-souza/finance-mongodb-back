import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionEntity } from 'src/models/permissions/entities/permission.entity';
import { RoleEntity } from 'src/models/roles/entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<RoleEntity>,
    @InjectModel('Permission')
    private readonly permissionModel: Model<PermissionEntity>,
  ) {}

  async createRoles(roles: RoleEntity): Promise<RoleEntity> {
    const checkRoles = await this.roleModel.findOne({ name: roles.name });

    const checkPermissions = await this.permissionModel.findOne({
      _id: roles.permissions,
    });

    if (checkRoles) {
      throw new ConflictException('Role already exists');
    }

    if (!checkPermissions) {
      throw new NotFoundException('Permission does not exist');
    }

    const createdRole = await this.roleModel.create(roles);

    if (createdRole.permissions) {
      await this.roleModel.updateMany({
        permissions: createdRole.permissions,
        prermissionsName: checkPermissions.name,
      });
    }

    return createdRole;
  }
}
