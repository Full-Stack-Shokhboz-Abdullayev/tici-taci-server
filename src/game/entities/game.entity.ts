import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlayerDocument, PlayerSchema } from './player.entity';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  expireAt: Date;

  @Prop({ default: true })
  flip: boolean;

  @Prop({ type: PlayerSchema })
  maker: PlayerDocument;

  @Prop({ type: PlayerSchema })
  joiner: PlayerDocument;
}

export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
