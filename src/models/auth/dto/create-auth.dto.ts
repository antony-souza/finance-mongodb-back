import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @Transform(({ value }) => value?.toString())
  email: string;

  @MinLength(6)
  @IsString()
  @Transform(({ value }) => value?.toString())
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toString())
  token?: string;
}
