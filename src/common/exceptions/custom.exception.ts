import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly errorCode?: string,
  ) {
    super(
      {
        success: false,
        message,
        error: errorCode || 'CUSTOM_ERROR',
        timestamp: new Date().toISOString(),
        statusCode,
      },
      statusCode,
    );
  }
}

export class ResourceNotFoundException extends CustomException {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }
}

export class ValidationException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends CustomException {
  constructor(message: string = 'Access forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

export class ConflictException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT');
  }
} 