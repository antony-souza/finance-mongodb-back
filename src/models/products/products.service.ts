import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from 'src/repositories/product.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async findAllByStore(storeId: string) {
    return await this.productRepository.findAllByStore(storeId);
  }

  async findOne(id: string) {
    return await this.productRepository.findOneProduct(id);
  }

  async update(updateUserDto: UpdateProductDto) {
    const findProduct = await this.productRepository.findProductByName(
      updateUserDto.name,
      updateUserDto.store._id,
    );

    if (!findProduct) {
      throw new NotAcceptableException('Product not found');
    }

    let url = findProduct.image_url;

    if (updateUserDto.image_url) {
      url = await this.uploadService.upload(updateUserDto.image_url);
    }

    return this.productRepository.updateProduct(findProduct._id, {
      ...updateUserDto,
      image_url: url,
    });
  }
}
