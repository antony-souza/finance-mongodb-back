import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import GeneratePasswordService from 'src/utils/hashPassword/hash-pass.service';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { TransformIdService } from 'src/utils/transformId.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transformIdService: TransformIdService,
    private readonly generatePasswordService: GeneratePasswordService,
    private readonly uploadFileFactoryService: UploadFileFactoryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = await this.generatePasswordService.createHash(
      createUserDto.password,
    );

    let url = '';
    if (createUserDto.image_url) {
      url = await this.uploadFileFactoryService.upload(createUserDto.image_url);
    }

    const id = this.transformIdService.transform(createUserDto.store_id);

    return this.userRepository.createUser({
      ...createUserDto,
      password: password,
      store: id,
      image_url: url,
    });
  }
}
