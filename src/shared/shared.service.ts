import { Injectable, Logger } from '@nestjs/common';

import { Storage } from './firebase';
import { Bucket } from '@google-cloud/storage';
import { getTransport } from './smtp';
import { ConfigService } from '@nestjs/config';

import { format, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class SharedService {
  private readonly logger = new Logger(SharedService.name);

  private bucket: Bucket;
  private Transport;
  constructor(private readonly configService: ConfigService) {
    this.bucket = Storage.bucket();
    this.Transport = getTransport(
      this.configService.get('NODEMAILER_USER'),
      this.configService.get('NODEMAILER_PASS'),
    );
  }

  /////////////////////////////////////////
  //////////FIREBASESTORAGESERVICES///////

  async uploadImageFile(
    file: any,
    fileName: string,
  ): Promise<{ filePath: string; error: boolean; fileName: string }> {
    return new Promise(async (resolve, reject) => {
      const fileNameFinal = 'images/' + fileName;
      try {
        const blob = this.bucket.file(fileNameFinal);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', (error) => {
          this.logger.error(error);
          return reject({ filePath: null, error: true, fileName });
        });

        blobStream.on('finish', async () => {
          const metaData = {
            contentType: 'image/jpg',
          };
          try {
            await this.bucket.file(fileNameFinal).setMetadata(metaData);
          } catch (error) {
            this.logger.error(error);
            return reject({ filePath: null, error: true, fileName });
          }

          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;

          try {
            await this.bucket.file(fileNameFinal).makePublic();
          } catch (error) {
            this.logger.error(error);
            return reject({ filePath: null, error: true, fileName });
          }
          resolve({ filePath: publicUrl, error: false, fileName });
        });

        blobStream.end(file);
      } catch (error) {
        this.logger.error(error);
        reject({ filePath: null, error: true, fileName });
      }
    });
  }

  async uploadKYCImageFile(
    file: any,
    fileName: string,
  ): Promise<{ filePath: string; error: boolean; fileName: string }> {
    return new Promise(async (resolve, reject) => {
      const fileNameFinal = 'KYCimages/' + fileName;
      try {
        const blob = this.bucket.file(fileNameFinal);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', (error) => {
          this.logger.error(error);
          return reject({ filePath: null, error: true, fileName });
        });

        blobStream.on('finish', async () => {
          const metaData = {
            contentType: 'image/jpg',
          };
          try {
            await this.bucket.file(fileNameFinal).setMetadata(metaData);
          } catch (error) {
            this.logger.error(error);
            return reject({ filePath: null, error: true, fileName });
          }

          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;

          try {
            await this.bucket.file(fileNameFinal).makePublic();
          } catch (error) {
            this.logger.error(error);
            return reject({ filePath: null, error: true, fileName });
          }
          resolve({ filePath: publicUrl, error: false, fileName });
        });

        blobStream.end(file);
      } catch (error) {
        this.logger.error(error);
        reject({ filePath: null, error: true, fileName });
      }
    });
  }

  /////////////////////////////////////////
  /////////////////////////////////////////

  /////////////////////////////////////////
  ////////MAILSERVICES/////////////////////

  async sendOtpMail(
    email: string,
    otp: string,
  ): Promise<{ mail: any; error: boolean }> {
    const mailOptions = {
      from: '181200107002@asoit.edu.in',
      to: email,
      subject: 'Email OTP Verification',
      html: `<h1>Your OTP for email verification is ${otp}. Please do not share this secret code. This code is only valid for 5 min.</h1>`,
    };

    let emailSent;
    let error = false;
    try {
      emailSent = await this.Transport.sendMail(mailOptions);
    } catch (error1) {
      this.logger.error(error1);
      error = true;
    }
    return { mail: emailSent, error };
  }

  async sendProductRejectMail(email: string, reason: string): Promise<any> {
    const mailOptions = {
      from: '181200107002@asoit.edu.in',
      to: email,
      subject: 'Product declined',
      html: `
      <h1>Your product request is declined by our admin</h1>
      <p>Reason: ${reason}</p>
      `,
    };

    let emailSent;
    let error = false;
    try {
      emailSent = await this.Transport.sendMail(mailOptions);
    } catch (error1) {
      this.logger.error(error1);
      error = true;
    }
    return { mail: emailSent, error };
  }

  async sendKYCRejectMail(email: string, reason: string): Promise<any> {
    const mailOptions = {
      from: '181200107002@asoit.edu.in',
      to: email,
      subject: 'KYC declined',
      html: `
      <h1>Your KYC approval is declined by our admin</h1>
      <p>Reason: ${reason}</p>
      `,
    };

    let emailSent;
    let error = false;
    try {
      emailSent = await this.Transport.sendMail(mailOptions);
    } catch (error1) {
      this.logger.error(error1);
      error = true;
    }
    return { mail: emailSent, error };
  }

  /////////////////////////////////////////
  /////////////////////////////////////////

  generateOTP(): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  getPast12MonthsDates(): Array<{ label: string; start: Date; end: Date }> {
    const labels: Array<{ label: string; start: Date; end: Date }> = [];

    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const dateObj = new Date().setMonth(now.getMonth() - i);
      const label = format(new Date(dateObj), 'MMM, yyyy');
      labels.push({
        label: label,
        start: startOfMonth(new Date(dateObj)),
        end: endOfMonth(new Date(dateObj)),
      });
    }

    return labels;
  }
}
