import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  playerType: 'maker' | 'joiner';
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
