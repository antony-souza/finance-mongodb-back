import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { ProductRepository } from 'src/repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../products/entities/product.entity';
import { StoreSchema } from '../stores/entities/store.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [SheetsController],
  providers: [SheetsService, ProductRepository],
})
export class SheetsModule {}
