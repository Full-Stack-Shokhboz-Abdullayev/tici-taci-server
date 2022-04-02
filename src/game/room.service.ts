import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnvironmentVariables } from '../shared/config/dto/env-variables.dto';
import { Room, RoomDocument } from './entities/room.entity';

type MDate = Date & { addHours: (h: number) => Date };

(Date.prototype as MDate).addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private RoomModel: Model<RoomDocument>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  set(roomId: string, body: Partial<Omit<Room, 'roomId'>>) {
    return this.RoomModel.updateOne(
      { roomId },
      {
        roomId,
        ...body,
        expireAt: (new Date() as MDate).addHours(
          this.configService.get('GAME_DURATION'),
        ),
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  updateByPlayerType(
    playerType: string,
    code: string,
    body: Partial<Omit<Room, 'roomId'>>,
  ) {
    return this.RoomModel.updateOne(
      { playerType, code },
      {
        playerType: body.playerType,
      },
      { new: true, runValidators: true },
    );
  }

  get(roomId: string) {
    return this.RoomModel.findOne({ roomId });
  }
  delete(roomId: string) {
    return this.RoomModel.findOneAndRemove({ roomId });
  }
}
