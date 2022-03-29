import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseValidation } from '../shared/decorators/use-validation.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { GameDocument } from './entities/game.entity';
import calculateWinner from './game.logic';
import { GameService } from './game.service';
import { SignEnum } from './typings/enums/sign.enum';

type Rooms = Map<Socket, { code: string; playerType: 'maker' | 'joiner' }>;

@UseValidation()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayDisconnect {
  constructor(@Inject(GameService) private gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  rooms: Rooms = new Map();

  @SubscribeMessage('check')
  async check(
    @MessageBody() { code }: { code: string },
  ): Promise<WsResponse<GameDocument>> {
    const game = await this.gameService.findOne({ code });

    return {
      event: 'check-complete',
      data: game,
    };
  }

  @SubscribeMessage('create')
  async create(
    @MessageBody() data: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<GameDocument>> {
    const game = await this.gameService.create(data);

    client.join(game.code);
    this.rooms.set(client, { code: game.code, playerType: 'maker' });
    return {
      event: 'create-complete',
      data: game,
    };
  }

  @SubscribeMessage('join')
  async join(
    @MessageBody() { code, ...body }: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { data } = await this.check({ code });

    if (!data) {
      throw new WsException({
        message: 'Game not found!',
      });
    }

    const socketsSize = (await client.in(code).allSockets()).size;

    if (socketsSize >= 2) {
      throw new WsException({
        message: 'Game is full!',
      });
    }

    const game = await this.gameService.update({
      code,
      ...body,
      joiner: {
        name: body.joiner.name,
        sign: data.maker.sign === SignEnum.O ? SignEnum.X : SignEnum.O,
      },
    });

    client.join(game.code);
    this.rooms.set(client, { code: game.code, playerType: 'joiner' });

    client.broadcast.to(game.code).emit('player-joined', game);

    return {
      event: 'join-complete',
      data: game,
    };
  }

  @SubscribeMessage('move')
  async move(
    @MessageBody()
    {
      cells,
      idx,
      xIsNext,
      code,
    }: { cells: string[]; idx: number; xIsNext: boolean; code: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!cells[idx]) {
      cells[idx] = xIsNext ? SignEnum.X : SignEnum.O;
    }

    const {
      winner,
      line: { line },
    } = calculateWinner(cells);

    const result = {
      winner,
      line: winner && winner !== 'tie' ? line : {},
      cells,
      xIsNext: !xIsNext,
    };

    client.broadcast.to(code).emit('move-complete', result);

    console.log(this.rooms.values());

    return {
      event: 'move-complete',
      data: result,
    };
  }

  @SubscribeMessage('restart')
  async restart(@MessageBody() { code }, @ConnectedSocket() client: Socket) {
    console.log(code, '\n', client.id);

    client.broadcast.to(code).emit('restart-made');
  }

  async handleDisconnect(client: Socket) {
    const playerRoom = this.rooms.get(client);
    if (playerRoom.playerType === 'joiner') {
      const game = await this.gameService.update({
        code: playerRoom.code,
        joiner: null,
      });
      client.broadcast.to(game.code).emit('opponent-left', game);
    } else if (playerRoom.playerType === 'maker') {
      const game = await this.gameService.findOne({
        code: playerRoom.code,
      });
      if (!game.joiner) {
        await game.remove();
      } else if (game.joiner) {
        const updatedGame = await this.gameService.update({
          code: game.code,
          maker: game.joiner,
          joiner: null,
        });
        client.broadcast.to(game.code).emit('opponent-left', updatedGame);
      }
    }
    this.rooms.delete(client);
  }
}
