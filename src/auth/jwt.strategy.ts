/**
 * Injectable strategy for JWT (JSON Web Token) authentication using PassportJS.
 *
 * This strategy extends `PassportStrategy` from `@nestjs/passport` and utilizes `passport-jwt`
 * for validating JWT tokens extracted from the authorization header.
 * It validates the token's authenticity and extracts user information from the token payload.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Configures the JWT strategy with options for token extraction, verification, and decoding
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from Authorization header
      ignoreExpiration: false, // Determines if token expiration should be ignored (default: false)
      secretOrKey: '1inch-secret-key', // Secret key used for verifying the JWT signature
    });
  }

  /**
   * Validates the payload extracted from the JWT token.
   *
   * @param {any} payload - The payload object extracted from the JWT token.
   * @returns {any} - The validated user information extracted from the payload.
   *
   * Extracts `userId` and `username` from the JWT payload to validate and authorize the user.
   * Returns an object containing `userId` and `username` for authenticated users.
   */
  validate(payload: any): any {
    return { userId: payload.sub, username: payload.username };
  }
}
