import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Response } from 'express';
import { FilesController } from './file.controller';
import { FilesService } from './file.service';

describe('FilesController', () => {
  let controller: FilesController;
  let filesServiceMock: jest.Mocked<FilesService>;

  beforeEach(async () => {
    filesServiceMock = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getFile: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: filesServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<FilesController>(FilesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file and return its version', async () => {
      const mockFile = {
        originalname: 'test.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const mockUserId = 1;
      const mockReq = {
        user: { userId: mockUserId },
      };
      const mockFileName = 'test.png';
      filesServiceMock.uploadFile.mockResolvedValue(mockFileName);

      const result = await controller.uploadFile(mockFile, mockReq);

      expect(result).toEqual({ version: mockFileName });
      expect(filesServiceMock.uploadFile).toHaveBeenCalledWith(
        mockFile,
        mockUserId,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file by version', async () => {
      const version = 'test.png';
      const mockUserId = 1;
      const mockReq = {
        user: { userId: mockUserId },
      };
      await controller.deleteFile(version, mockReq);

      expect(filesServiceMock.deleteFile).toHaveBeenCalledWith(
        version,
        mockUserId,
      );
    });
  });

  describe('getFile', () => {
    it('should get a file by version', async () => {
      const version = 'test.png';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as any as Response;
      const mockFileData = Buffer.from('file data');
      filesServiceMock.getFile.mockResolvedValue(mockFileData);

      await controller.getFile(version, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockFileData);
      expect(filesServiceMock.getFile).toHaveBeenCalledWith(version);
    });
  });
});
