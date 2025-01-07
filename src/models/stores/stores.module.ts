import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './entities/store.entity';
import { StoreRespository } from 'src/models/stores/store.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [StoresController],
  providers: [StoresService, StoreRespository, UploadFileFactoryService],
})
export class StoresModule {}
