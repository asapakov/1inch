/**
 * Service responsible for handling authentication operations using JWT (JSON Web Tokens).
 *
 * This service utilizes the `JwtService` from `@nestjs/jwt` for generating JWT tokens.
 * It provides methods to facilitate user login and generate JWT tokens based on user credentials.
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT access token for the provided user.
   *
   * @param {any} user - The user object containing at least `username` and `userId` properties.
   * @returns {Promise<{ access_token: string }>} - A promise resolving to an object with the generated access token.
   *
   * Generates a JWT token with a payload containing `username` and `userId`.
   * The generated token can be used for authentication and authorization purposes.
   */
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
