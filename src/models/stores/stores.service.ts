import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreRespository } from 'src/models/stores/store.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepository: StoreRespository,
    private readonly uploadFileFactoryService: UploadFileFactoryService,
  ) {}

  findAll() {
    return this.storeRepository.findAll();
  }

  async create(createStoreDto: CreateStoreDto) {
    let url = '';
    if (createStoreDto.image_url) {
      url = await this.uploadFileFactoryService.upload(
        createStoreDto.image_url,
      );
    }

    return this.storeRepository.createStore({
      ...createStoreDto,
      image_url: url,
    });
  }
}
