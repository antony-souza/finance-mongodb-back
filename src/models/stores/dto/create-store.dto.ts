import { IsOptional, IsString } from 'class-validator';
import { UserEntity } from 'src/models/users/entities/user.entity';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsString()
  @IsOptional()
  user_id?: string;
}
