import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/models/products/entities/product.entity';
import { CreateSaleDto } from 'src/models/sales/dto/create-sale.dto';
import { UpdateSaleDto } from 'src/models/sales/dto/update-sale.dto';
import { Sales } from 'src/models/sales/entities/sale.entity';
import { IBillingsStore } from 'src/models/sales/sales.service';
import { Store } from 'src/models/stores/entities/store.entity';
import { User } from 'src/models/users/entities/user.entity';

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
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
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

  async createSales(data: CreateSaleDto): Promise<Sales> {
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

    const updatedStockProduct = await this.productModel.findOneAndUpdate(
      {
        _id: checkProduct._id,
        stock: { $gte: data.quantitySold - checkSales.quantitySold },
      },
      {
        $inc: { stock: checkSales.quantitySold - data.quantitySold },
      },
      { new: true },
    );

    if (!updatedStockProduct) {
      throw new ConflictException(
        'Insufficient stock to update the sale - Repository',
      );
    }

    const updatedSale = await this.salesModel.findByIdAndUpdate(
      id,
      {
        ...data,
        totalBilled: data.quantitySold * checkProduct.price,
      },
      { new: true },
    );

    if (!updatedSale) {
      throw new NotFoundException('Sale not updated - Repository');
    }

    return updatedSale;
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          productId: '$product_id',
          productName: '$productName',
          productImg: '$productImg',
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
          userName: '$userName',
          userRole: '$userRole',
          userImg: '$userImg',
          storeName: '$storeName',
        },
      },
    ]);
  }

  async getSalesByDate(
    storeId: string,
    startDate: string,
    endDate: string,
  ): Promise<ISalesResponse[]> {
    return await this.salesModel.aggregate([
      {
        $match: {
          store_id: `${storeId}`,
          createdAt: {
            $gte: new Date(`${startDate}T00:00:00Z`),
            $lte: new Date(`${endDate}T23:59:59Z`),
          },
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
          productId: '$product_id',
          productName: '$productName',
          productImg: '$productImg',
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
          userName: '$userName',
          userRole: '$userRole',
          userImg: '$userImg',
          storeName: '$storeName',
        },
      },
    ]);
  }

  getSalesTopEmployees(storeId: string) {
    return this.salesModel.aggregate([
      {
        $match: {
          store_id: `${storeId}`,
        },
      },
      {
        $group: {
          _id: '$user_id',
          totalBilled: {
            $sum: '$totalBilled',
          },
          quantitySold: {
            $sum: '$quantitySold',
          },
          userName: {
            $first: '$userName',
          },
          userRole: {
            $first: '$userRole',
          },
          userImg: {
            $first: '$userImg',
          },
        },
      },
      {
        $sort: {
          totalBilled: -1,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          userName: '$userName',
          userRole: '$userRole',
          userImg: '$userImg',
          totalBilled: '$totalBilled',
          quantitySold: '$quantitySold',
        },
      },
    ]);
  }

  async getAllDeliverySales(storeId: string) {
    return await this.salesModel
      .aggregate([
        {
          $match: {
            store_id: storeId,
            isDelivery: true,
          },
        },
        {
          $sort: {
            deliveryDate: 1,
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            productId: '$product_id',
            productName: '$productName',
            productImg: '$productImg',
            quantitySold: '$quantitySold',
            totalBilled: '$totalBilled',
            clientName: '$clientName',
            deliveryAddress: '$deliveryAddress',
            deliveryDate: {
              $dateToString: {
                format: '%d/%m/%Y',
                date: '$deliveryDate',
              },
            },
          },
        },
      ])
      .exec();
  }
}
