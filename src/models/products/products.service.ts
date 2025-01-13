import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from 'src/models/products/product.repository';
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

  async searchAllProductsFromStoreByName(storeId: string, name: string) {
    return await this.productRepository.searchAllProductsFromStoreByName(
      storeId,
      name,
    );
  }

  async findOne(id: string) {
    return await this.productRepository.findOneProduct(id);
  }

  async update(updateUserDto: UpdateProductDto) {
    const findProduct = await this.productRepository.findOneProduct(
      updateUserDto._id,
    );

    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }

    let url = findProduct.image_url;

    if (updateUserDto.image_url) {
      url = await this.uploadService.upload(updateUserDto.image_url);
    }

    let stock = findProduct.stock;

    if (updateUserDto.stock) {
      stock = stock + updateUserDto.stock;
    }

    return this.productRepository.updateProduct(updateUserDto._id, {
      ...updateUserDto,
      image_url: url,
      stock: stock,
    });
  }

  async delete(id: string) {
    return this.productRepository.deleteProduct(id);
  }
}
