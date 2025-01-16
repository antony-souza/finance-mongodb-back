import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/models/roles/entities/role.entity';
import { Store } from 'src/models/stores/entities/store.entity';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  store: Store;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  role: Role;

  @IsOptional()
  storeId?: string;

  @IsOptional()
  recoveryCode?: number;
}
