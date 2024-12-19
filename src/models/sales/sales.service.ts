import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesRepository } from 'src/repositories/sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createSaleDto: CreateSaleDto) {
    const existingProduct = await this.salesRepository.findProductById(
      createSaleDto.product_id,
    );

    const totalBilled = createSaleDto.quantitySold * existingProduct.price;

    await this.salesRepository.updateStock(
      existingProduct.id,
      createSaleDto.quantitySold,
    );

    const createSales = await this.salesRepository.create({
      ...createSaleDto,
      totalBilled: totalBilled,
    });

    return createSales;
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
