import { IsOptional, IsString } from 'class-validator';
import { PermissionEntity } from 'src/models/permissions/entities/permission.entity';

export class CreateRoleDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  prermissionsName?: string[];

  @IsString()
  permissions: PermissionEntity[];
}
