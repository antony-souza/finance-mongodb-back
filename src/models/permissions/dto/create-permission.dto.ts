import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
