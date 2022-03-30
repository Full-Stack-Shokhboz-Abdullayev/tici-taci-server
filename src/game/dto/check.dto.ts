import { IsUUID } from 'class-validator';

export class CheckDto {
  @IsUUID(4)
  code: string;
}
