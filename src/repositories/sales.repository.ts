import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { CreateSaleDto } from 'src/models/sales/dto/create-sale.dto';
import { SalesEntity } from 'src/models/sales/entities/sale.entity';
import { IBillingsStore } from 'src/models/sales/sales.service';
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

  async createSales(createSaleDto: CreateSaleDto): Promise<SalesEntity> {
    const createSales = await this.salesModel.create(createSaleDto);

    if (createSales.store_id) {
      await this.storeModel.findByIdAndUpdate(
        createSales.store_id,
        {
          $addToSet: { sales: createSales._id },
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

  async getBillingsByStore(storeId: string): Promise<IBillingsStore[]> {
    return await this.salesModel.aggregate([
      {
        $match: {
          store_id: `${storeId}`,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'productsData',
        },
      },
      {
        $unwind: {
          path: '$productsData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$product_id',
          name: {
            $first: '$productsData.name',
          },
          quantitySold: {
            $sum: '$quantitySold',
          },
          totalBilled: {
            $sum: '$totalBilled',
          },
        },
      },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          name: '$name',
          quantitySold: '$quantitySold',
          totalBilled: '$totalBilled',
        },
      },
    ]);
  }

  async findAllSalesByStore(storeId: string) {
    return await this.salesModel.aggregate([
      {
        $match: {
          store_id: `${storeId}`,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'usersData',
        },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'store_id',
          foreignField: '_id',
          as: 'storesData',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'productsData',
        },
      },
      {
        $unwind: {
          path: '$storesData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$usersData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$productsData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$product_id',
          productName: '$productsData.name',
          productImg: '$productsData.image_url',
          quantitySold: '$quantitySold',
          date: {
            $dateToString: {
              format: '%d-%m-%Y',
              date: '$createdAt',
            },
          },
          hour: {
            $dateToString: {
              format: '%H:%M:%S',
              date: '$createdAt',
              timezone: 'America/Sao_Paulo',
            },
          },
          totalBilled: '$totalBilled',
          userName: '$usersData.name',
          userRole: '$usersData.roleName',
          userImg: '$usersData.image_url',
          storeName: '$storesData.name',
        },
      },
    ]);
  }
}
