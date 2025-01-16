import { IsEmail, IsOptional } from 'class-validator';

export class CreateNodemailerDto {
  @IsEmail()
  email: string;

  @IsOptional()
  recoveryCode?: number;

  @IsOptional()
  codeExpires?: Date;
}
