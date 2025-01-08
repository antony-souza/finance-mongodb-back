import { IsOptional, IsString } from 'class-validator';
import { Permission } from 'src/models/permissions/entities/permission.entity';

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
  permissions: Permission[];
}
