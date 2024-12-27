import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
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

  @Get('/store/all/:storeId')
  findAllByStore(@Param('storeId') storeId: string) {
    return this.productsService.findAllByStore(storeId);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put('/update')
  @UseInterceptors(FileInterceptor('image_url'))
  update(
    @Body() updateProductDto: CreateProductDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.productsService.update({
      ...updateProductDto,
      image_url: image_url,
    });
  }
}
