import { IsEmail } from 'class-validator';

export class CreateNodemailerDto {
  @IsEmail()
  email: string;
}
