import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Recovery {
  @Prop({ type: mongoose.Types.UUID, default: uuidv4, required: false })
  _id?: string;

  @Prop({ type: Number, required: true })
  recoveryCode: number;

  @Prop({ type: Date, required: true })
  codeExpires: Date;

  @Prop({ type: mongoose.Types.UUID, default: uuidv4, required: true })
  userId: string;
}
