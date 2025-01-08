import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { Store, StoreSchema } from '../stores/entities/store.entity';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { ProductRepository } from 'src/models/products/product.repository';
import { TokenGuards } from 'src/guards/token.guards';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/middleware/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UploadFileFactoryService,
    ProductRepository,
    TokenGuards,
    JwtService,
    JwtAuthService,
  ],
})
export class ProductsModule {}
