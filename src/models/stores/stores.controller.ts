import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('/all')
  findAll() {
    return this.storesService.findAll();
  }
  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.storesService.create({
      ...createStoreDto,
      image_url: image_url,
    });
  }
}
