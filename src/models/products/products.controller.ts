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
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenGuards } from 'src/guards/token.guards';
import { UpdateProductDto } from './dto/update-product.dto';

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

  @Get('/search/:store/:name')
  findAllProductsByName(
    @Param('store') store: string,
    @Param('name') name: string,
  ) {
    return this.productsService.searchAllProductsFromStoreByName(store, name);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.productsService.update({
      ...updateProductDto,
      _id: id,
      image_url: image_url,
    });
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
