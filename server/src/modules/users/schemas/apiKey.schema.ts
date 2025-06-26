import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type apiKeyDocument = HydratedDocument<apiKey>;

@Schema()
export class apiKey {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const apiKeySchema = SchemaFactory.createForClass(apiKey);
