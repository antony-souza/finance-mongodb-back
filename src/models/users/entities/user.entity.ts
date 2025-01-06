import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { StoreEntity } from 'src/models/stores/entities/store.entity';
import { v4 as uuidv4 } from 'uuid';
@Schema({ versionKey: false, timestamps: true })
export class UserEntity {
  @Prop({ type: String, required: false, default: uuidv4 })
  _id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true })
  image_url: string;

  @Prop({ type: Date, required: false, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: mongoose.Types.UUID, ref: 'Store', required: false })
  store: StoreEntity;

  @Prop({ type: String, required: false })
  storeName?: string;

  @Prop({ type: String, required: false })
  roleName?: string;

  @Prop({ type: mongoose.Types.UUID, ref: 'Role', required: true })
  role: RoleEntity;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
