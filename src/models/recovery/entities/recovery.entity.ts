import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Recovery {
  @Prop({ type: String, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: String, required: true })
  recoveryCode: string;

  @Prop({ type: Date, required: true })
  codeExpires: Date;

  @Prop({ type: Boolean, default: true, required: false })
  enabled?: boolean;

  @Prop({
    type: mongoose.Types.UUID,
    default: uuidv4,
    required: true,
    ref: 'User',
  })
  user: string;
}

export const RecoverySchema = SchemaFactory.createForClass(Recovery);
