import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class TransformIdService
  implements PipeTransform<string, Types.ObjectId>
{
  transform(value: string): Types.ObjectId {
    return new Types.ObjectId(value);
  }
}
