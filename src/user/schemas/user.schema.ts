import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { AuthData } from './auth-data.schema';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  mobile: string;

  @Prop({
    type: String,
    default: 'USER',
    required: true,
    enum: ['USER', 'ADMIN', 'SUPER_USER'],
  })
  role: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthData',
    required: true,
  })
  encryptedPassword: AuthData;
}

export const UserSchema = SchemaFactory.createForClass(User).set(
  'timestamps',
  true,
);
