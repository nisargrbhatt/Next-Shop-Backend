import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Response, Express, Request } from 'express';
import { AppService } from './app.service';
import { SharedService } from './shared/shared.service';

class FileUploadDto {
  @ApiProperty({ type: 'file', name: 'file', isArray: true })
  @IsOptional()
  file: any[];
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sharedService: SharedService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('testUpload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }]))
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  async testUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: FileUploadDto,
    @Res() res: Response,
  ) {
    let imageFiles = files['file'];
    let responseFiles = [];
    console.log('Loop Started');

    for (let i = 0; i < imageFiles.length; i++) {
      let currentFile = imageFiles[i];
      console.log(currentFile);

      let uploadedFile;
      try {
        uploadedFile = await this.sharedService.uploadImageFile(
          currentFile.buffer,
          `NS-${Date.now()}.jpg`,
        );
        console.log(uploadedFile);
      } catch (error) {
        console.log(error);
      }

      responseFiles.push(uploadedFile);
    }

    return res.status(HttpStatus.OK).json({ responseFiles });
  }
}
