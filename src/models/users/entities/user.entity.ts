import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { StoreEntity } from 'src/models/stores/entities/store.entity';

@Schema({ timestamps: true })
export class UserEntity {
  @Prop({ type: String, required: false })
  id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store: StoreEntity;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
