import configuration from './configuration';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default configuration when no environment variables are set', () => {
    // Clear specific environment variables for this test
    delete process.env.PORT;
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.MAX_FILE_SIZE;
    delete process.env.UPLOAD_PATH;
    delete process.env.NODE_ENV;

    const config = configuration();

    expect(config.port).toBe(3000);
    expect(config.database.url).toBeUndefined();
    expect(config.jwt.secret).toBeUndefined();
    expect(config.jwt.expiresIn).toBe('1d');
    expect(config.jwt.refreshSecret).toBeUndefined();
    expect(config.jwt.refreshExpiresIn).toBe('7d');
    expect(config.email.host).toBeUndefined();
    expect(config.email.port).toBe(587);
    expect(config.email.user).toBeUndefined();
    expect(config.email.pass).toBeUndefined();
    expect(config.upload.maxFileSize).toBe(5242880);
    expect(config.upload.uploadPath).toBe('./uploads');
    expect(config.app.nodeEnv).toBe('development');
  });

  it('should use environment variables when provided', () => {
    process.env.PORT = '4000';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/testdb';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '2h';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.JWT_REFRESH_EXPIRES_IN = '14d';
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '465';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'password123';
    process.env.MAX_FILE_SIZE = '10485760';
    process.env.UPLOAD_PATH = '/custom/uploads';
    process.env.NODE_ENV = 'production';

    const config = configuration();

    expect(config.port).toBe(4000);
    expect(config.database.url).toBe('postgresql://localhost:5432/testdb');
    expect(config.jwt.secret).toBe('test-secret');
    expect(config.jwt.expiresIn).toBe('2h');
    expect(config.jwt.refreshSecret).toBe('refresh-secret');
    expect(config.jwt.refreshExpiresIn).toBe('14d');
    expect(config.email.host).toBe('smtp.gmail.com');
    expect(config.email.port).toBe(465);
    expect(config.email.user).toBe('test@example.com');
    expect(config.email.pass).toBe('password123');
    expect(config.upload.maxFileSize).toBe(10485760);
    expect(config.upload.uploadPath).toBe('/custom/uploads');
    expect(config.app.nodeEnv).toBe('production');
  });

  it('should handle numeric environment variables correctly', () => {
    process.env.PORT = '5000';
    process.env.SMTP_PORT = '587';
    process.env.MAX_FILE_SIZE = '2097152';

    const config = configuration();

    expect(config.port).toBe(5000);
    expect(config.email.port).toBe(587);
    expect(config.upload.maxFileSize).toBe(2097152);
  });

  it('should handle string environment variables correctly', () => {
    process.env.JWT_SECRET = 'my-super-secret-key';
    process.env.JWT_EXPIRES_IN = '30m';
    process.env.SMTP_HOST = 'mail.example.com';
    process.env.UPLOAD_PATH = '/var/uploads';

    const config = configuration();

    expect(config.jwt.secret).toBe('my-super-secret-key');
    expect(config.jwt.expiresIn).toBe('30m');
    expect(config.email.host).toBe('mail.example.com');
    expect(config.upload.uploadPath).toBe('/var/uploads');
  });

  it('should have correct structure', () => {
    const config = configuration();

    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('database');
    expect(config).toHaveProperty('jwt');
    expect(config).toHaveProperty('email');
    expect(config).toHaveProperty('upload');
    expect(config).toHaveProperty('app');

    expect(config.database).toHaveProperty('url');
    expect(config.jwt).toHaveProperty('secret');
    expect(config.jwt).toHaveProperty('expiresIn');
    expect(config.jwt).toHaveProperty('refreshSecret');
    expect(config.jwt).toHaveProperty('refreshExpiresIn');
    expect(config.email).toHaveProperty('host');
    expect(config.email).toHaveProperty('port');
    expect(config.email).toHaveProperty('user');
    expect(config.email).toHaveProperty('pass');
    expect(config.upload).toHaveProperty('maxFileSize');
    expect(config.upload).toHaveProperty('uploadPath');
    expect(config.app).toHaveProperty('nodeEnv');
  });
}); 