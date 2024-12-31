import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { ProductRepository } from 'src/repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../products/entities/product.entity';
import { StoreSchema } from '../stores/entities/store.entity';
import { SalesRepository } from 'src/repositories/sales.repository';
import { SalesSchema } from '../sales/entities/sale.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: 'Sale', schema: SalesSchema }]),
  ],
  controllers: [SheetsController],
  providers: [SheetsService, ProductRepository, SalesRepository],
})
export class SheetsModule {}
