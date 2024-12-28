import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsRepository } from 'src/repositories/permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionsRepository) {}

  createPermission(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.createPermission(createPermissionDto);
  }
}
