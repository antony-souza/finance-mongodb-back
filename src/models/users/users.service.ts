import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import GeneratePasswordService from 'src/utils/hashPassword/hash-pass.service';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import { TransformIdService } from 'src/utils/transformId.service';
import { UpdateUserDto } from './dto/update-user.dto';

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

    return this.userRepository.createUser({
      ...createUserDto,
      password: password,
      image_url: url,
    });
  }

  async findAll() {
    return await this.userRepository.getAllUsers();
  }

  async findOne(id: string) {
    return await this.userRepository.getUserById(id);
  }

  async updateUserById(updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.getUserById(
      updateUserDto.id,
    );

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    let url = existingUser.image_url;

    if (updateUserDto.image_url) {
      url = await this.uploadFileFactoryService.upload(updateUserDto.image_url);
    }

    let hashPassword = updateUserDto.password;
    if (updateUserDto.password) {
      hashPassword = await this.generatePasswordService.createHash(
        updateUserDto.password,
      );
    }

    return this.userRepository.updateUserById(updateUserDto.id, {
      ...updateUserDto,
      image_url: url,
      password: hashPassword,
    });
  }

  async deleteUserById(id: string) {
    return this.userRepository.deleteUserById(id);
  }
}
