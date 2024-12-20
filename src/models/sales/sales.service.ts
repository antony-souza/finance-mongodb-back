import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from 'src/repositories/sales.repository';
import { formatPrice } from 'src/utils/formatPrice/formatPricer';

export interface IBillingsStore {
  id: string;
  name: string;
  totalBilled: number;
  quantitySold: number;
}

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createSaleDto: CreateSaleDto) {
    const existingProduct = await this.salesRepository.findProductById(
      createSaleDto.product_id,
    );

    if (existingProduct.stock < createSaleDto.quantitySold) {
      throw new ConflictException('Product out of stock');
    }

    const totalBilled = createSaleDto.quantitySold * existingProduct.price;

    await this.salesRepository.updateStock(
      existingProduct.id,
      createSaleDto.quantitySold,
    );

    const createSales = await this.salesRepository.createSales({
      ...createSaleDto,
      totalBilled: totalBilled,
    });

    return createSales;
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
