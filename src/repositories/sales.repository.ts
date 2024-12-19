import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { CreateSaleDto } from 'src/models/sales/dto/create-sale.dto';
import { SalesEntity } from 'src/models/sales/entities/sale.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectModel('Sale') private readonly salesModel: Model<SalesEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
    @InjectModel('Product') private readonly productModel: Model<ProductEntity>,
  ) {}

  async findProductById(productId: string) {
    const product = await this.productModel.findById(productId);

    return product;
  }

  async create(createSaleDto: CreateSaleDto): Promise<SalesEntity> {
    const createSales = await this.salesModel.create(createSaleDto);

    if (createSales.store_id) {
      await this.storeModel.findByIdAndUpdate(
        createSales.store_id,
        {
          $addToSet: { sales: createSales.id },
        },
        { new: true },
      );
    }
    return createSales;
  }

  async updateStock(productId: ObjectId, quantitySold: number) {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: -quantitySold },
      },
      { new: true },
    );
    return product;
  }

  async getBillingsByStore(storeId: string) {
    const query = await this.salesModel.aggregate([
      {
        $match: {
          store: storeId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'prevProducts',
        },
      },
      {
        $unwind: '$prevProducts',
      },
      {
        $group: {
          _id: '$product_id',
          productName: { $first: '$prevProducts.name' },
          totalBilled: { $sum: '$totalBilled' },
          quantitySold: { $sum: '$quantitySold' },
        },
      },
      {
        $project: {
          _id: 0,
          store: '$_id',
          totalBilled: 1,
          quantitySold: 1,
          products: '$prevProducts',
        },
      },
    ]);
    return query;
  }
}
