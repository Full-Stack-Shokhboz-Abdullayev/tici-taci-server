import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PlayerDto } from './player.dto';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({
    each: true,
  })
  @Type(() => PlayerDto)
  maker: PlayerDto;
}
