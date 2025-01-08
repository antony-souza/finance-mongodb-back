import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/models/permissions/entities/permission.entity';
import { Role } from 'src/models/roles/entities/role.entity';

export interface IRoleResponse {
  id: string;
  name: string;
  permissionsName: string[];
}

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async createRoles(roles: Role): Promise<Role> {
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

    const createdRole = await this.roleModel.create({
      ...roles,
      permissionsName: checkPermissions.name,
    });

    return createdRole;
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleModel.aggregate([
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$name',
          permissionsName: '$permissionsName',
        },
      },
    ]);
  }

  async getRoleById(roleId: string): Promise<IRoleResponse[]> {
    return await this.roleModel.aggregate([
      {
        $match: {
          _id: `${roleId}`,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$name',
          permissionsName: '$permissionsName',
        },
      },
    ]);
  }
}
