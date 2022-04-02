import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { EnvironmentVariables } from '../shared/config/dto/env-variables.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { Game, GameDocument } from './entities/game.entity';

type MDate = Date & { addHours: (h: number) => Date };

(Date.prototype as MDate).addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

@Injectable()
export class GameService {
  constructor(
    @InjectModel('Game') private GameModel: Model<Game>,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  create(body: CreateGameDto) {
    const game = new this.GameModel({
      ...body,
      code: v4(),
      expireAt: (new Date() as MDate).addHours(
        this.configService.get('GAME_DURATION'),
      ),
    });

    return game.save();
  }

  findOne(criteria: Partial<GameDocument>) {
    return this.GameModel.findOne({ code: criteria.code });
  }

  update({ code, ...body }: any) {
    return this.GameModel.findOneAndUpdate({ code: code }, body, {
      runValidators: true,
      new: true,
    });
  }

  async updateScore({
    code,
    winnerType,
  }: {
    code: string;
    winnerType: string;
  }) {
    return this.GameModel.findOneAndUpdate(
      { code },
      {
        $inc: {
          [`${winnerType}.score`]: 1,
        },
      },
      {
        runValidators: true,
        new: true,
      },
    );
  }

  delete({ code }: Partial<JoinGameDto>) {
    return this.GameModel.findOneAndRemove({ code });
  }
}
