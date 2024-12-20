import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('/create')
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get('/billings/:store_id')
  getBillingsByStore(@Param('store_id') store_id: string) {
    return this.salesService.getBillingsByStore(store_id);
  }

  @Get('/all')
  findAllSales() {
    return this.salesService.findAllSales();
  }
}
