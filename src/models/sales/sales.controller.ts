import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { TokenGuards } from 'src/guards/token.guards';
import { AllowedRoles, RolesGuard } from 'src/guards/role.guard';
import { RolesEnum } from 'src/utils/enuns/roles';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(TokenGuards, RolesGuard)
@Controller('/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @AllowedRoles(
    RolesEnum.Desenvolvedor,
    RolesEnum.Gerente,
    RolesEnum.Subgerente,
  )
  @Post('/create')
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @AllowedRoles(
    RolesEnum.Desenvolvedor,
    RolesEnum.Gerente,
    RolesEnum.Subgerente,
    RolesEnum.Vendedor,
  )
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.updateSales(id, updateSaleDto);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.salesService.deleteSales(id);
  }

  @AllowedRoles(
    RolesEnum.Desenvolvedor,
    RolesEnum.Gerente,
    RolesEnum.Subgerente,
  )
  @Get('/billings/:store_id')
  getBillingsByStore(@Param('store_id') store_id: string) {
    return this.salesService.getBillingsByStoreForCharts(store_id);
  }

  @AllowedRoles(RolesEnum.Gerente, RolesEnum.Vendedor, RolesEnum.Subgerente)
  @Get('/store/:store_id')
  findAllSalesByStore(@Param('store_id') store_id: string) {
    return this.salesService.getAllSalesByStore(store_id);
  }

  @AllowedRoles(
    RolesEnum.Desenvolvedor,
    RolesEnum.Gerente,
    RolesEnum.Subgerente,
  )
  @Get('/all/date')
  @UseInterceptors(FileInterceptor(''))
  findAllSalesByDate(
    @Body('storeId') storeId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    return this.salesService.getAllSalesByDate(storeId, startDate, endDate);
  }
}
