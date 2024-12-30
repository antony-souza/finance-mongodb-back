import { IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  image_url?: Express.Multer.File;

  @IsString()
  @IsOptional()
  user_id?: string;
}
