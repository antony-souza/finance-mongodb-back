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

  async getAllProductsByStore(storeId: string) {
    return this.productModel.find({ store: storeId }).lean();
  }

  async findAllByStore(storeId: string) {
    return await this.productModel.aggregate([
      {
        $match: {
          store: `${storeId}`,
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'storeData',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoriesData',
        },
      },
      {
        $unwind: {
          path: '$storeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$categoriesData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          product_name: '$name',
          product_price: '$price',
          product_description: '$description',
          product_image_url: '$image_url',
          product_quantity: '$stock',
          category_name: '$categoriesData.name',
          store_id: '$store',
          store_name: '$storeData.name',
        },
      },
    ]);
  }

  async findOneProduct(id: string) {
    const product = await this.productModel.findOne({
      _id: id,
    });

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
    return await this.productModel.updateOne({ _id: id }, data);
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
