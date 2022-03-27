import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SignEnum } from '../typings/enums/sign.enum';

export class JoinerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class PlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SignEnum)
  sign: SignEnum;
}
