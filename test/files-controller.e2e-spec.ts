import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FilesService } from '../src/file/file.service';
import { FilesController } from '../src/file/file.controller';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

describe('FilesController (e2e)', (): void => {
  let app: INestApplication;
  let filesServiceMock: jest.Mocked<FilesService>;
  let jwtService: JwtService;

  beforeAll(async (): Promise<void> => {
    filesServiceMock = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getFile: jest.fn(),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: '1inch-secret-key',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: filesServiceMock,
        },
        JwtAuthGuard,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          return Boolean(request.headers.authorization);
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = app.get(JwtService);
    await app.init();
  });

  afterAll(async (): Promise<void> => {
    await app.close();
  });

  it('should return 401 for POST /file/private without token', () => {
    return request(app.getHttpServer())
      .post('/file/private')
      .attach('file', Buffer.from('test file content'), 'test.png')
      .expect(403);
  });

  it('should return 401 for DELETE /file/private/:version without token', () => {
    return request(app.getHttpServer())
      .delete('/file/private/test-version')
      .expect(403);
  });

  it('should return 201 for POST /file/private with valid token', () => {
    filesServiceMock.uploadFile.mockResolvedValue('test-version');

    const token = 'Bearer ' + jwtService.sign({ username: 'test', sub: '1' });

    return request(app.getHttpServer())
      .post('/file/private')
      .set('Authorization', token)
      .attach('file', Buffer.from('test file content'), 'test.png')
      .expect(201)
      .expect({ version: 'test-version' });
  });

  it('should return 200 for DELETE /file/private/:version with valid token', () => {
    const token = 'Bearer ' + jwtService.sign({ username: 'test', sub: '1' });

    return request(app.getHttpServer())
      .delete('/file/private/test-version')
      .set('Authorization', token)
      .expect(200);
  });
});
