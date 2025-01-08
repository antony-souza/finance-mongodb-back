import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Permission } from 'src/models/permissions/entities/permission.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class Role {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: false })
  permissionsName?: string[];

  @Prop({ type: [mongoose.Types.UUID], ref: 'Permission', required: true })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
