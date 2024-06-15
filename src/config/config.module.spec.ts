import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './config.module';

describe('ConfigurationModule', (): void => {
  let configService: ConfigService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', (): void => {
    expect(ConfigurationModule).toBeDefined();
  });

  it('should load minio configuration from environment variables', (): void => {
    process.env.MINIO_ENDPOINT = 'localhost';
    process.env.MINIO_ACCESS_KEY = '1inch-access-key';
    process.env.MINIO_SECRET_KEY = '1inch-secret-key';
    process.env.MINIO_BUCKET_NAME = 'files';

    const minioConfig = configService.get('minio');
    expect(minioConfig).toEqual({
      endPoint: 'localhost',
      accessKey: '1inch-access-key',
      secretKey: '1inch-secret-key',
      bucketName: 'files',
    });
  });
});
