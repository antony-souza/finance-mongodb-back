import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateSaleDto {
  @IsOptional()
  _id?: string;

  @IsString()
  @IsOptional()
  productImg?: string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  product_id: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  userImg?: string;

  @IsString()
  @IsOptional()
  userRole?: string;

  @IsString()
  user_id: string;

  @IsString()
  @IsOptional()
  storeImg?: string;

  @IsString()
  @IsOptional()
  storeName?: string;

  @IsString()
  store_id: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  totalBilled?: number;

  @IsNumber()
  quantitySold: number;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsString()
  clientName: string;

  @IsBoolean()
  isDelivery: boolean;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;
}
