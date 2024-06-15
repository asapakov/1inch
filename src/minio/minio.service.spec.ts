import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

class MockConfigService extends ConfigService {
  get(key: string): any {
    switch (key) {
      case 'minio.endPoint':
        return 'localhost';
      case 'minio.accessKey':
        return '1icnh-key';
      case 'minio.secretKey':
        return '1icnh-key';
      default:
        return undefined;
    }
  }
}

describe('MinioService', (): void => {
  let service: MinioService;
  let clientMock: jest.Mocked<Client>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    service = module.get<MinioService>(MinioService);
    clientMock = service.getClient() as jest.Mocked<Client>;
  });

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });

  it('should create a bucket if it does not exist', async (): Promise<void> => {
    const bucketName = 'test-bucket';
    jest.spyOn(clientMock, 'bucketExists').mockResolvedValueOnce(false);
    jest.spyOn(clientMock, 'makeBucket').mockResolvedValueOnce();

    await service.createBucketIfNotExists(bucketName);

    expect(clientMock.bucketExists).toHaveBeenCalledWith(bucketName);
    expect(clientMock.makeBucket).toHaveBeenCalledWith(bucketName, 'us-east-1');
  });

  it('should not create a bucket if it already exists', async (): Promise<void> => {
    const bucketName = 'existing-bucket';
    jest.spyOn(clientMock, 'bucketExists').mockResolvedValueOnce(true);
    jest.spyOn(clientMock, 'makeBucket').mockResolvedValueOnce();

    await service.createBucketIfNotExists(bucketName);

    expect(clientMock.bucketExists).toHaveBeenCalledWith(bucketName);
    expect(clientMock.makeBucket).not.toHaveBeenCalled();
  });
});
