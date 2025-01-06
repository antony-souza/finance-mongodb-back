import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from 'src/repositories/sales.repository';
import { formatPrice } from 'src/utils/formatPrice/formatPricer';
import { UpdateSaleDto } from './dto/update-sale.dto';

export interface IBillingsStore {
  id: string;
  productName: string;
  totalBilled: number;
  quantitySold: number;
  storeName: string;
}

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createSaleDto: CreateSaleDto) {
    const checkProductUserStore =
      await this.salesRepository.findProductsAndUser(
        createSaleDto.product_id,
        createSaleDto.user_id,
        createSaleDto.store_id,
      );

    if (!checkProductUserStore) {
      throw new NotFoundException('Product, User or Store not found - Service');
    }

    if (checkProductUserStore.checkProduct.stock < createSaleDto.quantitySold) {
      throw new ConflictException('Product out of stock');
    }

    const totalBilled =
      createSaleDto.quantitySold * checkProductUserStore.checkProduct.price;

    await this.salesRepository.updateStock(
      checkProductUserStore.checkProduct._id,
      createSaleDto.quantitySold,
    );

    const createSales = await this.salesRepository.createSales({
      ...createSaleDto,
      productName: checkProductUserStore.checkProduct.name,
      storeName: checkProductUserStore.checkStore.name,
      userName: checkProductUserStore.checkUser.name,
      totalBilled: totalBilled,
    });

    return createSales;
  }

  async updateSales(id: string, updateSaleDto: UpdateSaleDto) {
    return this.salesRepository.updateSales(id, updateSaleDto);
  }

  async deleteSales(id: string) {
    return this.salesRepository.deleteSales(id);
  }

  async getBillingsByStoreForCharts(store_id: string) {
    return await this.salesRepository.getBillingsByStore(store_id);
  }

  async getAllSalesByStore(storeId: string) {
    const sales = await this.salesRepository.findAllSalesByStore(storeId);

    return sales.map((sale) => ({
      ...sale,
      totalBilled: formatPrice(sale.totalBilled),
    }));
  }
}
