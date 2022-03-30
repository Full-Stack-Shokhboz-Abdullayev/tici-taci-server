import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameSchema } from './entities/game.entity';
import { RoomSchema } from './entities/room.entity';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Game',
        schema: GameSchema,
      },
      {
        name: 'Room',
        schema: RoomSchema,
      },
    ]),
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, RoomService],
})
export class GameModule {}
