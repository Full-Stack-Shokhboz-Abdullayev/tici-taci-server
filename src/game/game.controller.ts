import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { GameService } from './game.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(@Inject(GameService) private readonly gameService: GameService) {}

  @Post()
  async create(@Body() body: CreateGameDto) {
    return await this.gameService.create(body);
  }

  @Get()
  async check(@Query('code', ParseUUIDPipe) code: string) {
    if (!code) {
      throw new NotFoundException('Game not found!');
    }
    this.gameService.findOne({ code });
  }

  @Put()
  async join(@Body() { code, ...body }: JoinGameDto) {
    if (!code) {
      throw new NotFoundException('Game not found!');
    }
    this.gameService.update({ code, ...body });
  }

  @Delete()
  async delete(@Query('code', ParseUUIDPipe) code: string) {
    if (!code) {
      throw new NotFoundException('Game not found!');
    }
    this.gameService.delete({ code });
  }
}
