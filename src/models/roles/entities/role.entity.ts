import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema()
export class RoleEntity {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [mongoose.Types.UUID], ref: 'Permission', required: true })
  permissions: mongoose.Types.UUID[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
