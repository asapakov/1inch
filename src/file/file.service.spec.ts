import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { FilesService } from './file.service';

describe('FilesService', () => {
  let service: FilesService;
  let minioServiceMock: jest.Mocked<MinioService>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    minioServiceMock = {
      getClient: jest.fn(),
      createBucketIfNotExists: jest.fn().mockResolvedValue(0),
    } as any;

    configServiceMock = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'minio.bucketName':
            return 'test-bucket';
          default:
            return undefined;
        }
      }),
    } as any;

    service = new FilesService(minioServiceMock, configServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload file to Minio', async () => {
      const mockFile: any = {
        originalname: 'testfile.png',
        buffer: Buffer.from('Test file content'),
      };

      const mockClient = {
        putObject: jest.fn().mockResolvedValue(0),
      };
      minioServiceMock.getClient.mockReturnValue(mockClient as any);

      const fileName = await service.uploadFile(mockFile);

      expect(fileName).toBeDefined();
      expect(mockClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.any(String), // fileName
        expect.any(String), // filePath
      );
    });
  });

  describe('getFile', () => {
    it('should get file from Minio', async () => {
      const mockStream = {
        [Symbol.asyncIterator]: jest.fn().mockReturnValue({
          next: jest
            .fn()
            .mockResolvedValueOnce({
              value: Buffer.from('file content'),
              done: false,
            })
            .mockResolvedValueOnce({ value: null, done: true }),
        }),
      };

      const mockClient = {
        getObject: jest.fn().mockResolvedValue(mockStream),
      };
      minioServiceMock.getClient.mockReturnValue(mockClient as any);

      const fileVersion = 'testfile.txt';

      const fileBuffer = await service.getFile(fileVersion);

      expect(fileBuffer).toBeDefined();
      expect(fileBuffer).toEqual(Buffer.from('file content'));
      expect(mockClient.getObject).toHaveBeenCalledWith(
        'test-bucket',
        fileVersion,
      );
    });

    it('should throw NotFoundException when file is not found', async () => {
      const mockClient = {
        getObject: jest.fn().mockRejectedValue(new Error('File not found')),
      };
      minioServiceMock.getClient.mockReturnValue(mockClient as any);

      const fileVersion = 'nonexistentfile.txt';

      await expect(service.getFile(fileVersion)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete file from Minio', async () => {
      const mockClient = {
        removeObject: jest.fn().mockResolvedValue(0),
      };
      minioServiceMock.getClient.mockReturnValue(mockClient as any);

      const fileVersion = 'testfile.txt';

      await service.deleteFile(fileVersion);

      expect(mockClient.removeObject).toHaveBeenCalledWith(
        'test-bucket',
        fileVersion,
      );
    });
  });
});
