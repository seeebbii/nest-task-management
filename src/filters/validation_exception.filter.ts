import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const validationErrors = exception.getResponse()['message']; // This contains the validation errors

        // Transform the validation errors to the desired format
        const formattedErrors = validationErrors.map(error => {
            const splitError = error.split(' ');
            const property = splitError.shift(); // Get the property name
            return {
                [property]: splitError.join(' ')
            };
        });

        response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            data: formattedErrors
        });
    }
}
