import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all/store/:id')
  findAllCategoriesByStore(@Param('id') id: string) {
    return this.categoriesService.findAllCategoriesByStore(id);
  }

  @Get('/search/:storeId/:name')
  searchCategoriesFromStoreByName(
    @Param('storeId') storeId: string,
    @Param('name') name: string,
  ) {
    return this.categoriesService.searchCategoriesFromStoreByName({
      storeId: storeId,
      name: name,
    });
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.categoriesService.createCategory({
      ...createCategoryDto,
      image_url: image_url,
    });
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image_url: Express.Multer.File,
  ) {
    return this.categoriesService.updateCategoryById({
      ...updateCategoryDto,
      id: id,
      image_url: image_url,
    });
  }

  @Delete('/delete/:id')
  deleteCategoryById(@Param('id') id: string) {
    return this.categoriesService.deleteCategoryById(id);
  }
}
