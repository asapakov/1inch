import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', (): void => {
    it('should validate and return user data', (): void => {
      const payload = { sub: 1, username: '1inch-testuser' };
      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: payload.sub,
        username: payload.username,
      });
    });
  });
});
