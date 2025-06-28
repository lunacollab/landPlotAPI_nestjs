import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({}),
      getResponse: () => ({})
    })
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformInterceptor],
    }).compile();

    interceptor = module.get<TransformInterceptor<any>>(TransformInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should transform successful response', (done) => {
      const mockData = { id: '1', name: 'Test' };
      const mockCallHandler = {
        handle: () => of(mockData),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: mockData,
            message: 'Operation completed successfully',
            path: undefined,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should transform array response', (done) => {
      const mockData = [{ id: '1', name: 'Test' }];
      const mockCallHandler = {
        handle: () => of(mockData),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: mockData,
            message: 'Operation completed successfully',
            path: undefined,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should transform null response', (done) => {
      const mockCallHandler = {
        handle: () => of(null),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: null,
            message: 'Operation completed successfully',
            path: undefined,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should transform empty response', (done) => {
      const mockCallHandler = {
        handle: () => of(undefined),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual({
            success: true,
            data: undefined,
            message: 'Operation completed successfully',
            path: undefined,
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });
  });
}); 