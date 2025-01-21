import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesRepository } from 'src/models/sales/sales.repository';
import { formatPrice } from 'src/utils/formatPrice/formatPricer';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SocketGateway } from 'src/websocket/websocket.gateway';

export interface IBillingsStore {
  id: string;
  productName: string;
  totalBilled: number;
  quantitySold: number;
  storeName: string;
}

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly webSocketService: SocketGateway,
  ) {}

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

    const totalBilled =
      createSaleDto.quantitySold * checkProductUserStore.checkProduct.price;

    const createSales = await this.salesRepository.createSales({
      ...createSaleDto,
      productImg: checkProductUserStore.checkProduct.image_url,
      productName: checkProductUserStore.checkProduct.name,
      storeImg: checkProductUserStore.checkStore.image_url,
      storeName: checkProductUserStore.checkStore.name,
      userImg: checkProductUserStore.checkUser.image_url,
      userName: checkProductUserStore.checkUser.name,
      userRole: checkProductUserStore.checkUser.roleName,
      totalBilled: totalBilled,
    });

    const billings = await this.salesRepository.getBillingsByStore(
      createSaleDto.store_id,
    );

    await this.webSocketService.sendBillingsByStore(
      createSaleDto.store_id,
      billings,
    );

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

  async getAllSalesByDate(updateSaleDto: UpdateSaleDto) {
    const sales = await this.salesRepository.getSalesByDate(
      updateSaleDto.store_id,
      updateSaleDto.startDate,
      updateSaleDto.endDate,
    );

    return sales.map((sale) => ({
      ...sale,
      totalBilled: formatPrice(sale.totalBilled),
    }));
  }

  async getSalesByUser(storeId: string) {
    const sales = await this.salesRepository.getSalesTopEmployees(storeId);

    return sales.map((sale) => ({
      ...sale,
      totalBilled: formatPrice(sale.totalBilled),
    }));
  }

  async getDeliverySales(dto: UpdateSaleDto) {
    return await this.salesRepository.getAllDeliverySales(dto.store_id);
  }
}
