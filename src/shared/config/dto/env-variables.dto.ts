import { IsEnum, IsNumber, Matches } from 'class-validator';
import { MONGO_URI_PATTERN } from '../constants/regexs';
import { Environment } from '../typings/enums/env.enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @Matches(MONGO_URI_PATTERN)
  MONGO_URI: string;

  @IsNumber()
  GAME_DURATION: number;
}
