import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRecoveryDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  recoveryCode?: number;

  @IsOptional()
  codeExpires?: Date;

  @IsOptional()
  user?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  enabled?: boolean;
}
