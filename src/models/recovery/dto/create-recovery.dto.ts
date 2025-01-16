import { IsEmail, IsOptional, IsString } from 'class-validator';

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
  enabled?: boolean;
}
