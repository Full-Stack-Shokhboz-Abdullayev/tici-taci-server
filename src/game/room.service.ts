import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private RoomModel: Model<RoomDocument>) {}

  set(roomId: string, body: Omit<Room, 'roomId'>) {
    const room = new this.RoomModel({
      roomId,
      ...body,
    });

    return room.save();
  }
  get(roomId: string) {
    return this.RoomModel.findOne({ roomId });
  }
  delete(roomId: string) {
    return this.RoomModel.findOneAndRemove({ roomId });
  }
}
