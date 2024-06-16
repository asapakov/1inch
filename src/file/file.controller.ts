import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  Get,
  Res,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('File controller')
@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Handles HTTP POST requests to upload a file.
   *
   * @param {Express.Multer.File} file - The file to be uploaded, extracted from multipart/form-data.
   * @param {any} req - The request object, containing the user information.
   * @returns {Promise<any>} - A promise that resolves to an object containing the version (or unique identifier) of the uploaded file.
   *
   * This controller method performs the following steps:
   * 1. Extracts the user ID from the request object (assumed to be populated by the JwtAuthGuard).
   * 2. Calls the `uploadFile` method of the `filesService` to upload the file and log the upload event.
   * 3. Returns an object with the version (file name) of the uploaded file as the response.
   *
   * The method is protected by the `JwtAuthGuard`, ensuring that only authenticated users can access it.
   * It uses the `@UseGuards(JwtAuthGuard)` decorator to enforce this.
   * The `@UseInterceptors(FileInterceptor('file'))` decorator is used to handle file uploads via multipart/form-data.
   * The `@ApiBearerAuth()` decorator is used to indicate that the endpoint requires bearer token authentication.
   * The `@ApiConsumes('multipart/form-data')` decorator specifies the content type consumed by the endpoint.
   * The `@ApiResponse` decorator provides an example response structure indicating the version of the uploaded file.
   * The `@ApiBody` decorator specifies the expected request body schema for documentation purposes.
   */
  @UseGuards(JwtAuthGuard)
  @Post('private')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '',
    content: {
      'application/json': {
        example: {
          version: '416dc085-6cae-4ddd-979d-e944d23239bf.png',
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user?.userId;
    const fileName: string = await this.filesService.uploadFile(file, userId);
    return { version: fileName };
  }

  /**
   * Handles HTTP DELETE requests to delete a file by its version.
   *
   * @param {string} version - The version (or unique identifier) of the file to delete.
   * @param {any} req - The request object, containing the user information.
   * @returns {Promise<void>} - A promise that resolves when the file has been deleted.
   *
   * This controller method performs the following steps:
   * 1. Extracts the user ID from the request object (assumed to be populated by the JwtAuthGuard).
   * 2. Calls the `deleteFile` method of the `filesService` to delete the file and log the deletion event.
   *
   * The method is protected by the `JwtAuthGuard`, ensuring that only authenticated users can access it.
   * It uses the `@UseGuards(JwtAuthGuard)` decorator to enforce this.
   * The `@ApiBearerAuth()` decorator is used to indicate that the endpoint requires bearer token authentication.
   */
  @UseGuards(JwtAuthGuard)
  @Delete('private/:version')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file by version' })
  @ApiResponse({ status: HttpStatus.OK, description: 'File deleted' })
  @ApiParam({ name: 'version', required: true })
  async deleteFile(
    @Param('version') version: string,
    @Req() req: any,
  ): Promise<void> {
    const userId = req.user?.userId;
    await this.filesService.deleteFile(version, userId);
  }

  /**
   * Handles HTTP GET requests to retrieve a file by its version.
   *
   * @param {string} version - The version (or unique identifier) of the file to retrieve.
   * @param {Response} res - The response object used to send the file data.
   * @returns {Promise<void>} - A promise that resolves when the file data has been sent in the response.
   *
   * This controller method performs the following steps:
   * 1. Calls the `getFile` method of the `filesService` to retrieve the file data as a Buffer.
   * 2. Sets the response header to indicate the content type is an octet-stream.
   * 3. Sends the file data in the HTTP response.
   *
   * If the file is not found, the `filesService.getFile` method will throw a `NotFoundException`,
   * which is handled by NestJS global exception filter to return a 404 response.
   */
  @Get('public/:version')
  @ApiOperation({ summary: 'Get a file by version' })
  @ApiParam({ name: 'version', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'File found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'File not found' })
  async getFile(
    @Param('version') version: string,
    @Res() res: Response,
  ): Promise<void> {
    const fileData: Buffer = await this.filesService.getFile(version);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(fileData);
  }
}
