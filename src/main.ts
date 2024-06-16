import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: NestApplication = await NestFactory.create(AppModule);

  // Global validation pipe to enforce validation rules for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips incoming data to allow only properties defined in DTOs
      forbidNonWhitelisted: true, // Throws an error if incoming data contains properties not defined in DTOs
      stopAtFirstError: true, // Stops validation process on first validation error encountered
      transform: true, // Automatically transforms incoming data to match the DTO schema
    }),
  );

  // Swagger API documentation setup
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('File Versioning API') // Title of the Swagger documentation
    .setDescription(
      'API for managing file versioning with public and private endpoints', // Description of the API
    )
    .setVersion('1.0') // Version of the API
    .addBearerAuth() // Configures Bearer token authentication for Swagger UI
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config); // Generates the OpenAPI document
  SwaggerModule.setup('api-docs', app, document); // Sets up Swagger UI endpoint with generated documentation

  await app.listen(3000); // Starts the NestJS application on port 3000
}

bootstrap(); // Executes the bootstrap function to start the application
