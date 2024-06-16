/**
 * Controller for handling authentication-related operations.
 *
 * This controller provides endpoints for user authentication, such as login.
 * It utilizes the `AuthService` to perform authentication logic.
 */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth controller') // Tags this controller for Swagger API documentation
@Controller('/auth') // Base route path for all endpoints in this controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user login authentication.
   *
   * @param {AuthLoginDto} authBody - DTO containing user login credentials.
   * @returns {Promise<any>} - A promise that resolves to authentication result.
   *
   * Authenticates the user based on provided credentials using the `AuthService`.
   * Returns the result of authentication, including an access token on successful login.
   */
  @UseGuards() // Applies guards globally or locally to protect this endpoint
  @Post('/login') // HTTP POST endpoint for user login
  login(@Body() authBody: AuthLoginDto): Promise<any> {
    return this.authService.login(authBody);
  }
}
