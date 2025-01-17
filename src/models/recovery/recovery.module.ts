import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryController } from './recovery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { RecoveryRepository } from './recovery.repository';
import { Recovery, RecoverySchema } from './entities/recovery.entity';
import GeneratePasswordService from 'src/utils/hashPassword/hash-pass.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Recovery.name, schema: RecoverySchema },
    ]),
  ],
  controllers: [RecoveryController],
  providers: [RecoveryService, RecoveryRepository, GeneratePasswordService],
})
export class RecoveryModule {}
