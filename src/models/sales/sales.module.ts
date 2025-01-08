import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sales, SalesSchema } from './entities/sale.entity';
import { Store, StoreSchema } from '../stores/entities/store.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { SalesRepository } from 'src/models/sales/sales.repository';
import { ProductRepository } from 'src/models/products/product.repository';
import { TokenGuards } from 'src/guards/token.guards';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/middleware/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SalesController],
  providers: [
    SalesService,
    SalesRepository,
    ProductRepository,
    TokenGuards,
    JwtService,
    JwtAuthService,
  ],
})
export class SalesModule {}
