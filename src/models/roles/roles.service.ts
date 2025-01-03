import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesRepository } from 'src/repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  createRoles(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.createRoles(createRoleDto);
  }

  getRoles() {
    return this.rolesRepository.getRoles();
  }

  getRoleById(roleId: string) {
    return this.rolesRepository.getRoleById(roleId);
  }
}
