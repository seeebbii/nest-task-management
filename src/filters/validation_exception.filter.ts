import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const validationErrors = exception.getResponse()['message'];

        const errorMapping = {};

        validationErrors.forEach(error => {
            const splitError = error.split(' ');
            const property = splitError.shift();

            if (!errorMapping[property]) {
                errorMapping[property] = [];
            }
            errorMapping[property].push(splitError.join(' '));
        });

        const formattedErrors = Object.keys(errorMapping).map(key => ({
            [key]: errorMapping[key]
        }));

        response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            data: formattedErrors
        });
    }
}
