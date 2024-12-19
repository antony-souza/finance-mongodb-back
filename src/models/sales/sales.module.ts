import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesSchema } from './entities/sale.entity';
import { StoreSchema } from '../stores/entities/store.entity';
import { UserSchema } from '../users/entities/user.entity';
import { ProductSchema } from '../products/entities/product.entity';
import { SalesRepository } from 'src/repositories/sales.repository';
import { ProductRepository } from 'src/repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sale', schema: SalesSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository, ProductRepository],
})
export class SalesModule {}
