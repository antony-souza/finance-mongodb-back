import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseInterceptors(FileInterceptor(''))
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.authUser(createAuthDto);
  }
}
