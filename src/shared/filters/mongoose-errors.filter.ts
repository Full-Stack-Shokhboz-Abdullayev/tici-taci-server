import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { mongo } from 'mongoose';
import { startCase, camelCase } from 'lodash';
@Catch(mongo.MongoError)
export class MongoExceptionFilter extends BaseWsExceptionFilter {
  private getMessage(code: number, keyValue: Record<string, string>) {
    switch (code) {
      case 11000:
        return Object.keys(keyValue).reduce((acc, current) => {
          console.log(acc);

          return {
            ...acc,
            [current]: `${startCase(camelCase(current))}: "${
              keyValue[current]
            }" already exists.`,
          };
        }, {});
      default:
        return 'Unknown error';
    }
  }
  catch(exception: any, argumentHost: ArgumentsHost) {
    const ctx = argumentHost.switchToWs();
    const messages = this.getMessage(exception.code, exception.keyValue);
    ctx.getClient().emit('exception', {
      messages,
    });
  }
}
