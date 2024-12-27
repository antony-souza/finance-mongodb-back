import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
  ) {}

  async findProductByName(name: string, store: string) {
    return this.productModel.findOne({ name: name, store: store });
  }

  async findOneProduct(id: string) {
    const product = await this.productModel.findOne({
      id: id,
    });
    console.log(product);
    return product;
  }

  async createProduct(product: ProductEntity) {
    const newProduct = await this.productModel.create(product);

    if (newProduct.store) {
      await this.storeModel.findByIdAndUpdate(
        newProduct.store,
        { $addToSet: { products: newProduct._id } },
        { new: true },
      );
    }

    return newProduct;
  }

  async updateProduct(id: string, data: Partial<ProductEntity>) {
    return await this.productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string) {
    const deleteProduct = await this.productModel.findByIdAndDelete(id);

    if (deleteProduct.store) {
      this.storeModel.findByIdAndUpdate(
        deleteProduct.store,
        { $pull: { products: deleteProduct._id } },
        { new: true },
      );
    }
  }
}
