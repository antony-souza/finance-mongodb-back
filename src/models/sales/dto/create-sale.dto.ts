import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  product_id: ProductEntity;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  user_id: UserEntity;

  @IsString()
  @IsOptional()
  storeName?: string;

  @IsString()
  store_id: StoreEntity;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  totalBilled?: number;

  @IsNumber()
  quantitySold: number;
}
