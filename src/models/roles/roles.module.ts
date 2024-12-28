import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './entities/role.entity';
import { RolesRepository } from 'src/repositories/roles.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
