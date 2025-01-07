import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'src/models/categories/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
  ) {}

  async findAllCategoriesByStore(id: string) {
    return await this.categoriesRepository.getCategoriesByStore(id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    let url = '';

    if (createCategoryDto.image_url) {
      url = await this.UploadFileFactoryService.upload(
        createCategoryDto.image_url,
      );
    }
    return await this.categoriesRepository.createCategory({
      ...createCategoryDto,
      image_url: url,
    });
  }

  async updateCategoryById(updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoriesRepository.getCategoryById(
      updateCategoryDto.id,
    );

    let url = existingCategory.image_url;

    if (updateCategoryDto.image_url) {
      url = await this.UploadFileFactoryService.upload(
        updateCategoryDto.image_url,
      );
    }

    return await this.categoriesRepository.updateCategory(
      updateCategoryDto.id,
      {
        ...updateCategoryDto,
        image_url: url,
      },
    );
  }

  async deleteCategoryById(id: string) {
    return await this.categoriesRepository.deleteCategory(id);
  }
}
