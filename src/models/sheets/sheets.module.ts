import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { ProductRepository } from 'src/models/products/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { StoreSchema } from '../stores/entities/store.entity';
import { SalesRepository } from 'src/models/sales/sales.repository';
import { Sales, SalesSchema } from '../sales/entities/sale.entity';
import { UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [SheetsController],
  providers: [SheetsService, ProductRepository, SalesRepository],
})
export class SheetsModule {}
