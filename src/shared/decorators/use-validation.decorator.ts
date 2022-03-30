import {
  applyDecorators,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

export const UseValidation = (): ClassDecorator =>
  applyDecorators(
    UseFilters(new BaseWsExceptionFilter()),
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
