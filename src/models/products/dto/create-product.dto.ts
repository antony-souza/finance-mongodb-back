import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoriesEntity } from 'src/models/categories/entities/category.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

export class CreateProductDto {
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  stock: number;

  @IsString()
  description: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsString()
  store: StoreEntity;

  @IsString()
  categories: CategoriesEntity;
}
