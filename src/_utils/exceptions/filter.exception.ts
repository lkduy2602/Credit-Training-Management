import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private static handleResponse(response: Response, exception: HttpException | Error): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getResponse()['statusCode'];
      const message = exception.getResponse()['message'];
      // if (Array.isArray(message)) {
      //   message = message.join(', ');
      // }
      responseBody = {
        status: exception.getResponse()['statusCode'],
        message,
        data: null,
      };
    } else if (exception instanceof Error) {
      responseBody = {
        status: statusCode,
        message: exception.stack,
        data: null,
      };
    }
    if (statusCode == 205) {
      statusCode = 400;
    }
    response.status(statusCode).json(responseBody);
  }

  public catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    //Response to client
    AllExceptionFilter.handleResponse(response, exception);
  }
}
