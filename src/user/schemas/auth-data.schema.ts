import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AuthData extends Document {
  @Prop({ type: String, required: true })
  encryptedPassword: string;
}

export const AuthDataSchema = SchemaFactory.createForClass(AuthData).set(
  'timestamps',
  true,
);
