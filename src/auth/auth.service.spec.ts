import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', (): void => {
  let service: AuthService;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtServiceMock = module.get<JwtService>(
      JwtService,
    ) as jest.Mocked<JwtService>;
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe('login', (): void => {
    it('should generate a JWT token', async (): Promise<void> => {
      const user = { username: 'testuser', userId: 1 };
      const mockToken = '1inch-mock-jwt-token';
      jwtServiceMock.sign.mockReturnValue(mockToken);

      const result = await service.login(user);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.userId,
      });
    });
  });
});
