import { Injectable } from '@nestjs/common';

import { Storage } from './firebase';
import { Bucket } from '@google-cloud/storage';
import { getTransport } from './smtp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedService {
  private bucket: Bucket;
  private Transport;
  constructor(private readonly configService: ConfigService) {
    this.bucket = Storage.bucket();
    this.Transport = getTransport(
      this.configService.get('NODEMAILER_USER'),
      this.configService.get('NODEMAILER_PASS'),
    );
  }

  async uploadImageFile(file: any, fileName: string) {
    return new Promise(async (resolve, reject) => {
      let fileNameFinal = 'images/' + fileName;
      try {
        const blob = this.bucket.file(fileNameFinal);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', (error) => {
          console.error(error);
          return reject({ filePath: null, error: error });
        });

        blobStream.on('finish', async (data) => {
          const metaData = {
            contentType: 'image/jpg',
          };
          try {
            await this.bucket.file(fileNameFinal).setMetadata(metaData);
          } catch (error) {
            console.error(error);
            return reject({ filePath: null, error: error });
          }

          const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;

          try {
            await this.bucket.file(fileNameFinal).makePublic();
          } catch (error) {
            console.error(error);
            return reject({ filePath: null, error: error });
          }
          resolve({ filePath: publicUrl, error: false });
        });

        blobStream.end(file);
      } catch (error) {
        console.error(error);
        reject({ filePath: null, error: error });
      }
    });
  }

  async sendOtpMail(email: string, otp: string): Promise<any> {
    const mailOptions = {
      from: '181200107002@asoit.edu.in',
      to: email,
      subject: 'Email OTP Verification',
      html: `<h1>Your OTP for email verification is ${otp}. Please do not share this secret code. This code is only valid for 5 min.</h1>`,
    };

    let emailSent;
    let error: boolean = false;
    try {
      emailSent = await this.Transport.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      error = true;
    }
    return { mail: emailSent, error };
  }

  generateOTP(): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
}
