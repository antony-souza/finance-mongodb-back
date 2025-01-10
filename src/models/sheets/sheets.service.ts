import * as xlsx from 'xlsx';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/models/products/product.repository';
import { SalesRepository } from 'src/models/sales/sales.repository';
import { formatPrice } from 'src/utils/formatPrice/formatPricer';

@Injectable()
export class SheetsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly salesRepository: SalesRepository,
  ) {}

  generateBufferSheets(data: any[]) {
    const convertedToBinaryBuffer = xlsx.utils.json_to_sheet(data);

    const newBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(newBook, convertedToBinaryBuffer, 'Sheets');

    const binarySheets = xlsx.write(newBook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return binarySheets;
  }

  async genericSheetsSales(data: any) {
    const mapSalesData = data.map((sales) => {
      const sheetTable = {
        Loja: sales.storeName,
        Produto: sales.productName,
        Quantidade: sales.quantitySold,
        Faturamento: sales.totalBilled,
        Vendedor: sales.userName,
        Cargo: sales.userRole,
        Data: sales.date,
        Horário: sales.hour,
      };
      return sheetTable;
    });

    const response = this.generateBufferSheets(mapSalesData);

    return response;
  }

  async generateBillingSheetByStore(id: string) {
    const salesData = await this.salesRepository.getBillingsByStore(id);

    if (!salesData || salesData.length === 0) {
      throw new NotFoundException('Sales not found');
    }

    const mapBillings = salesData.map((sales) => {
      const data = {
        Loja: sales.storeName,
        Produto: sales.productName,
        Faturamento: formatPrice(sales.totalBilled),
      };
      return data;
    });

    const data = this.generateBufferSheets(mapBillings);

    return data;
  }

  async generateSalesSheetByStore(id: string) {
    const salesData = await this.salesRepository.findAllSalesByStore(id);

    if (!salesData || salesData.length === 0) {
      throw new NotFoundException('Sales not found');
    }

    const data = this.genericSheetsSales(salesData);

    return data;
  }
}
