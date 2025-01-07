import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductEntity } from 'src/models/products/entities/product.entity';
import { CreateSaleDto } from 'src/models/sales/dto/create-sale.dto';
import { UpdateSaleDto } from 'src/models/sales/dto/update-sale.dto';
import { SalesEntity } from 'src/models/sales/entities/sale.entity';
import { IBillingsStore } from 'src/models/sales/sales.service';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { UserEntity } from 'src/models/users/entities/user.entity';

export interface ISalesResponse {
  productId: string;
  productName: string;
  productImg: string;
  quantitySold: number;
  date: string;
  hour: string;
  totalBilled: number;
  userName: string;
  userRole: string;
  userImg: string;
  storeName: string;
}

@Injectable()
export class SalesRepository {
  constructor(
    @InjectModel('Sale') private readonly salesModel: Model<SalesEntity>,
    @InjectModel('Store') private readonly storeModel: Model<StoreEntity>,
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
    @InjectModel('Product') private readonly productModel: Model<ProductEntity>,
  ) {}

  async findProductsAndUser(productId: string, userId, storeId) {
    const [checkProduct, checkUser, checkStore] = await Promise.all([
      this.productModel.findById(productId),
      this.userModel.findById(userId),
      this.storeModel.findById(storeId),
    ]);

    if (!checkProduct || !checkUser || !checkStore) {
      throw new NotFoundException(
        'Product, User or Store not found - Repository',
      );
    }

    return {
      checkProduct,
      checkUser,
      checkStore,
    };
  }

  async createSales(data: CreateSaleDto): Promise<SalesEntity> {
    const product = await this.productModel.findOne({
      _id: data.product_id,
      stock: { $gte: data.quantitySold },
    });

    if (!product) {
      throw new ConflictException('Product out of stock or not found');
    }

    const createSales = await this.salesModel.create(data);

    await this.productModel.findByIdAndUpdate(
      data.product_id,
      {
        $inc: { stock: -data.quantitySold },
      },
      { new: true },
    );

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

  async updateSales(id: string, data: UpdateSaleDto) {
    const checkSales = await this.salesModel.findById(id);

    if (!checkSales) {
      throw new NotFoundException('Sale not found - Repository');
    }

    const checkProduct = await this.productModel.findById(
      checkSales.product_id,
    );

    if (!checkProduct) {
      throw new NotFoundException('Product not found - Repository');
    }

    const sales = await this.salesModel.updateOne(
      { _id: checkSales._id },
      {
        ...data,
        totalBilled: data.quantitySold * checkProduct.price,
      },
      { new: true },
    );

    if (!sales) {
      throw new NotFoundException('Sale not updated - Repository');
    }

    this.productModel.updateOne(
      { _id: checkProduct._id, stock: { $gte: data.quantitySold } },
      {
        $inc: { stock: -data.quantitySold },
      },
    );
  }

  async deleteSales(saleId: string) {
    const checkSales = await this.salesModel.findById(saleId);

    if (!checkSales) {
      throw new NotFoundException('Sale not found - Repository');
    }

    const stockProduct = await this.productModel.findOneAndUpdate(
      { _id: checkSales.product_id, stock: { $gte: checkSales.quantitySold } },
      { $inc: { stock: checkSales.quantitySold } },
    );

    if (!stockProduct) {
      throw new NotFoundException('Product not found - Repository');
    }

    const sales = await this.salesModel.findByIdAndDelete(saleId);

    if (!sales) {
      throw new NotFoundException('Sale not deleted - Repository');
    }

    await this.storeModel.updateOne({
      $pull: { sales: saleId },
    });
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
          productName: {
            $first: '$productsData.name',
          },
          storeName: {
            $first: '$storeName',
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
          productName: '$productName',
          quantitySold: '$quantitySold',
          totalBilled: '$totalBilled',
          storeName: '$storeName',
        },
      },
    ]);
  }

  async findAllSalesByStore(storeId: string): Promise<ISalesResponse[]> {
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          productId: '$product_id',
          productName: '$productsData.name',
          productImg: '$productsData.image_url',
          quantitySold: '$quantitySold',
          date: {
            $dateToString: {
              format: '%d/%m/%Y',
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
