import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Schema()
export class StoreEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  users: UserEntity[];
}

export const StoreSchema = SchemaFactory.createForClass(StoreEntity);
