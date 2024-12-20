import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from 'src/repositories/product.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly uploadService: UploadFileFactoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    this.productRepository.findProductByName(
      createProductDto.name,
      createProductDto.store._id,
    );

    let url = '';
    if (createProductDto.image_url) {
      url = await this.uploadService.upload(createProductDto.image_url);
    }
    return this.productRepository.createProduct({
      ...createProductDto,
      image_url: url,
    });
  }

  findAll() {
    return `This action returns all products`;
  }

  async findOne(id: string) {
    return await this.productRepository.findOneProduct(id);
  }
}
