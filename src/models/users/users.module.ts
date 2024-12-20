import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import UploadFileFactoryService from 'src/utils/uploads/upload-file.service';
import GeneratePasswordService from 'src/utils/hashPassword/hash-pass.service';
import { TransformIdService } from 'src/utils/transformId.service';
import { StoreSchema } from '../stores/entities/store.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    UploadFileFactoryService,
    GeneratePasswordService,
    TransformIdService,
  ],
})
export class UsersModule {}
