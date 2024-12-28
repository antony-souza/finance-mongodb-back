import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ timestamps: true })
export class PermissionEntity {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(PermissionEntity);
