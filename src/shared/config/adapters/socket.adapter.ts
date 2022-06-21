import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../dto/env-variables.dto';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    options.cors = { origin: this.configService.get<string>('WS_ORIGIN') };
    const server = super.createIOServer(port, options);
    return server;
  }
}
