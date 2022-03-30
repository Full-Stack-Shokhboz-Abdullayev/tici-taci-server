import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private RoomModel: Model<RoomDocument>) {}

  set(roomId: string, body: Partial<Omit<Room, 'roomId'>>) {
    return this.RoomModel.updateOne(
      { roomId },
      { roomId, ...body },
      { upsert: true },
    );
  }
  get(roomId: string) {
    return this.RoomModel.findOne({ roomId });
  }
  delete(roomId: string) {
    return this.RoomModel.findOneAndRemove({ roomId });
  }
}
