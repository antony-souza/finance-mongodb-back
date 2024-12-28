import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor(''))
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRoles(createRoleDto);
  }
}
