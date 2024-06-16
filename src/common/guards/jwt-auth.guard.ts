/**
 * Injectable guard that extends the `AuthGuard` from `@nestjs/passport` for JWT authentication.
 *
 * This guard is used to protect routes and endpoints that require JWT (JSON Web Token) authentication.
 * It extends the base `AuthGuard` class and specifies 'jwt' as the strategy to be used for authentication,
 * meaning it will verify the validity and authenticity of JWT tokens provided in requests.
 *
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
