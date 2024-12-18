import { IsOptional, IsString } from 'class-validator';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsOptional()
  store: StoreEntity;
}
