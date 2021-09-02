import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Response, Express, Request } from 'express';
import { AppService } from './app.service';
import { SharedService } from './shared/shared.service';

class FileUploadDto {
  @ApiProperty({ type: 'file', name: 'file', isArray: true })
  @IsOptional()
  file: any[];
}

class EmailSendDto {
  @ApiProperty({ type: String, name: 'email', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    name: 'otp',
    required: true,
    maxLength: 4,
    minLength: 4,
  })
  @IsNotEmpty()
  otp: string;
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly sharedService: SharedService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello');
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
    this.logger.log('Loop Started');

    for (let i = 0; i < imageFiles.length; i++) {
      let currentFile = imageFiles[i];

      let uploadedFile;
      try {
        uploadedFile = await this.sharedService.uploadImageFile(
          currentFile.buffer,
          `NS-${Date.now()}.jpg`,
        );
      } catch (error) {
        this.logger.log(error);
      }

      responseFiles.push(uploadedFile);
    }

    return res.status(HttpStatus.OK).json({ responseFiles });
  }

  @Post('testEmail')
  @ApiBody({ type: EmailSendDto })
  async testEmail(@Body() body: EmailSendDto, @Res() res: Response) {
    let emailSent;
    try {
      emailSent = await this.sharedService.sendOtpMail(body.email, body.otp);
    } catch (error) {
      this.logger.log(error);
    }

    return res.status(HttpStatus.OK).json(emailSent);
  }
}
