import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsOptional()
  _id?: string;

  @IsString()
  productName: string;

  @IsString()
  product_id: string;

  @IsString()
  userName: string;

  @IsString()
  user_id: string;

  @IsString()
  storeName: string;

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
  date?: Date;
}
