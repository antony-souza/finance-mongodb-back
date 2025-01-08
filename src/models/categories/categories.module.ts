import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './entities/category.entity';
import { Store, StoreSchema } from '../stores/entities/store.entity';
import { CategoriesRepository } from 'src/models/categories/categories.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategoriesSchema },
    ]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    UploadFileFactoryService,
  ],
})
export class CategoriesModule {}
