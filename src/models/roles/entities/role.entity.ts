import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PermissionEntity } from 'src/models/permissions/entities/permission.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema()
export class RoleEntity {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: false })
  prermissionsName?: string[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Permission', required: true })
  permissions: PermissionEntity[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
