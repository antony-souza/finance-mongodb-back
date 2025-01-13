import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/store/:store_id')
  getAllUsersByStore(@Param('store_id') store_id: string) {
    return this.usersService.findAllUsersByStore(store_id);
  }

  @Get('/search/:store/:name')
  searchUsersFromStoreByName(
    @Param('store') store: string,
    @Param('name') name: string,
  ) {
    return this.usersService.searchUserFromStoreByName({
      storeId: store,
      name: name,
    });
  }

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

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.usersService.updateUserById({
      ...updateUserDto,
      _id: id,
      image_url: image_url,
    });
  }

  @Delete('/delete/:id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
