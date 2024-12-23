import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenGuards } from 'src/guards/token.guards';

@UseGuards(TokenGuards)
@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.productsService.create({
      ...createProductDto,
      image_url: image_url,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
