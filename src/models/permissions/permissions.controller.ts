import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor(''))
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.createPermission(createPermissionDto);
  }
}
