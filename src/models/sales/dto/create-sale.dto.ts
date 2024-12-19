import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

export class CreateSaleDto {
  @IsOptional()
  id?: string;

  @IsString()
  product_id: string;

  @IsString()
  user_id: string;

  @IsString()
  store_id: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  totalBilled?: number;

  @IsNumber()
  quantitySold: number;

  @IsString()
  @IsOptional()
  date?: string;
}
