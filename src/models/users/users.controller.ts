import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.usersService.create({
      ...createUserDto,
      image_url: image_url,
    });
  }

  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }
}
