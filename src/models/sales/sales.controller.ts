import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { TokenGuards } from 'src/guards/token.guards';

@UseGuards(TokenGuards)
@Controller('/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('/create')
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get('/billings/:store_id')
  getBillingsByStore(@Param('store_id') store_id: string) {
    return this.salesService.getBillingsByStoreForCharts(store_id);
  }

  @Get('/store/:store_id')
  findAllSalesByStore(@Param('store_id') store_id: string) {
    return this.salesService.getAllSalesByStore(store_id);
  }
}
