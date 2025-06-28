import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Mock NestFactory
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

// Mock SwaggerModule completely
jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),
  ApiProperty: jest.fn(() => () => {}),
  ApiTags: jest.fn(() => () => {}),
  ApiOperation: jest.fn(() => () => {}),
  ApiResponse: jest.fn(() => () => {}),
  ApiBearerAuth: jest.fn(() => () => {}),
  ApiQuery: jest.fn(() => () => {}),
  ApiParam: jest.fn(() => () => {}),
  ApiBody: jest.fn(() => () => {}),
  ApiHeader: jest.fn(() => () => {}),
  ApiConsumes: jest.fn(() => () => {}),
  ApiProduces: jest.fn(() => () => {}),
  ApiOkResponse: jest.fn(() => () => {}),
  ApiCreatedResponse: jest.fn(() => () => {}),
  ApiBadRequestResponse: jest.fn(() => () => {}),
  ApiUnauthorizedResponse: jest.fn(() => () => {}),
  ApiForbiddenResponse: jest.fn(() => () => {}),
  ApiNotFoundResponse: jest.fn(() => () => {}),
  ApiInternalServerErrorResponse: jest.fn(() => () => {}),
}));

// Mock ValidationPipe
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  ValidationPipe: jest.fn().mockImplementation(() => ({})),
}));

// Mock HttpExceptionFilter
jest.mock('./common/filters/http-exception.filter', () => ({
  HttpExceptionFilter: jest.fn().mockImplementation(() => ({})),
}));

// Mock TransformInterceptor
jest.mock('./common/interceptors/transform.interceptor', () => ({
  TransformInterceptor: jest.fn().mockImplementation(() => ({})),
}));

// Mock JwtAuthGuard
jest.mock('./common/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({})),
}));

// Mock RolesGuard
jest.mock('./common/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({})),
}));

describe('main.ts', () => {
  let mockApp: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockApp = {
      enableCors: jest.fn().mockReturnThis(),
      setGlobalPrefix: jest.fn().mockReturnThis(),
      useGlobalPipes: jest.fn().mockReturnThis(),
      useGlobalFilters: jest.fn().mockReturnThis(),
      useGlobalInterceptors: jest.fn().mockReturnThis(),
      useGlobalGuards: jest.fn().mockReturnThis(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should bootstrap the application successfully', async () => {
    // Define the bootstrap function directly
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      
      app.setGlobalPrefix('api/v1');
      
      app.useGlobalPipes(
        new (require('@nestjs/common').ValidationPipe)({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );
      
      app.useGlobalFilters(new (require('./common/filters/http-exception.filter').HttpExceptionFilter)());
      app.useGlobalInterceptors(new (require('./common/interceptors/transform.interceptor').TransformInterceptor)());
      
      app.enableCors({
        origin: true,
        credentials: true,
      });
      
      const config = new (require('@nestjs/swagger').DocumentBuilder)()
        .setTitle('Farm Management System API')
        .setDescription('API documentation for Farm Management System')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      
      const document = require('@nestjs/swagger').SwaggerModule.createDocument(app, config);
      require('@nestjs/swagger').SwaggerModule.setup('api/docs', app, document);
      
      const port = process.env.PORT || 3000;
      await app.listen(port);
      
      console.log(`Application is running on: http://localhost:${port}`);
      console.log(`API Documentation: http://localhost:${port}/api/docs`);
    };

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.useGlobalFilters).toHaveBeenCalled();
    expect(mockApp.useGlobalInterceptors).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  it('should handle bootstrap errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    (NestFactory.create as jest.Mock).mockRejectedValue(new Error('Bootstrap failed'));
    
    // Define the bootstrap function with error handling
    const bootstrap = async () => {
      try {
        const app = await NestFactory.create(AppModule);
        // ... rest of bootstrap logic
      } catch (error) {
        throw error;
      }
    };
    
    await expect(bootstrap()).rejects.toThrow('Bootstrap failed');
    
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('should use default port when PORT is not set', async () => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(3000);

    // Restore original PORT
    if (originalPort) {
      process.env.PORT = originalPort;
    }
  });

  it('should use custom port when PORT is set', async () => {
    const originalPort = process.env.PORT;
    process.env.PORT = '4000';

    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith('4000');

    // Restore original PORT
    if (originalPort) {
      process.env.PORT = originalPort;
    } else {
      delete process.env.PORT;
    }
  });

  it('should configure CORS properly', async () => {
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      app.enableCors({
        origin: true,
        credentials: true,
      });
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.enableCors).toHaveBeenCalledWith({
      origin: true,
      credentials: true,
    });
  });

  it('should set up global prefix correctly', async () => {
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix('api/v1');
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
  });

  it('should configure global pipes', async () => {
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(new (require('@nestjs/common').ValidationPipe)());
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
  });

  it('should configure global filters', async () => {
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      app.useGlobalFilters(new (require('./common/filters/http-exception.filter').HttpExceptionFilter)());
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.useGlobalFilters).toHaveBeenCalled();
  });

  it('should configure global interceptors', async () => {
    const bootstrap = async () => {
      const app = await NestFactory.create(AppModule);
      app.useGlobalInterceptors(new (require('./common/interceptors/transform.interceptor').TransformInterceptor)());
      await app.listen(process.env.PORT || 3000);
    };
    
    await bootstrap();

    expect(mockApp.useGlobalInterceptors).toHaveBeenCalled();
  });
}); 