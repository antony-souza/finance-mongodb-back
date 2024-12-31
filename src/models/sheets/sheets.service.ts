import * as xlsx from 'xlsx';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class SheetsService {
  constructor(private readonly productRepository: ProductRepository) {}

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

  async generateProductSheets(id: string) {
    const productsData = await this.productRepository.getAllProductsByStore(id);

    if (!productsData || productsData.length === 0) {
      throw new NotFoundException('Products not found');
    }

    const data = this.generateBufferSheets(productsData);

    return data;
  }
}
