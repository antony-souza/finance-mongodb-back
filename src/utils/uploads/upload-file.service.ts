import { Injectable } from '@nestjs/common';
import { ImgurUploadService } from './imgur-upload.service';
import { environment } from 'src/environment/environment';

type UPLOAD_SERVICE_TYPE = 'IMGUR';

@Injectable()
export default class UploadFileFactoryService {
  private readonly UPLOAD_SERVICE_TYPE: UPLOAD_SERVICE_TYPE = 'IMGUR';
  private readonly imgurUploadService: ImgurUploadService;

  constructor() {
    if (process.env.UPLOAD_SERVICE_TYPE) {
      this.UPLOAD_SERVICE_TYPE =
        environment.uploadServiceType as UPLOAD_SERVICE_TYPE;
    }

    this.imgurUploadService = new ImgurUploadService();
  }

  async upload(file: Express.Multer.File): Promise<string | undefined> {
    if (this.UPLOAD_SERVICE_TYPE === 'IMGUR') {
      return await this.imgurUploadService.upload(file);
    }
  }
}
