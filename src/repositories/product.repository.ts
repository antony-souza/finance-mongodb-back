import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
  ) {}

  async findProductByName(name: string, store: string) {
    return this.productModel.where({ name, store }).findOne();
  }

  async findOneProduct(id: string) {
    // Verifique se o ID é válido antes de realizar a consulta
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
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
}
