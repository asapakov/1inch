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
