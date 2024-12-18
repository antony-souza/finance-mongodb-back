import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { StoreSchema } from '../stores/entities/store.entity';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { ProductRepository } from 'src/repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UploadFileFactoryService, ProductRepository],
})
export class ProductsModule {}
