import { IsOptional, IsString } from 'class-validator';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsString()
  store: StoreEntity;
}
