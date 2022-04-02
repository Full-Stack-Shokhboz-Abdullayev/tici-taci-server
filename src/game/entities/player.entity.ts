import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SignEnum } from '../typings/enums/sign.enum';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sign: SignEnum;

  @Prop({ default: 0 })
  score: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
