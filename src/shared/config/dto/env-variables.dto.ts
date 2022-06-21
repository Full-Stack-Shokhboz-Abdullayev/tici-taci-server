import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environment } from '../typings/enums/env.enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  MONGO_URI: string;

  @IsNumber()
  GAME_DURATION: number;

  @IsString()
  WS_ORIGIN: string;

  @IsString()
  SITE_ORIGIN: string;
}
