import {
  applyDecorators,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { MongoExceptionFilter } from '../filters/mongoose-errors.filter';

export const UseValidation = (): ClassDecorator =>
  applyDecorators(
    // UseFilters(new BaseWsExceptionFilter()),
    UseFilters(new MongoExceptionFilter()),
    UsePipes(
      new ValidationPipe({
        exceptionFactory(validationErrors = []) {
          if (this.isDetailedOutputDisabled) {
            return new WsException('Bad request');
          }
          const errors = this.flattenValidationErrors(validationErrors);

          return new WsException({
            message: 'Validation Error!',
            errors,
            error: true,
          });
        },
      }),
    ),
  );
