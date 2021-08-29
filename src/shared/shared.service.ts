import { Injectable } from '@nestjs/common';

import { Storage } from './firebase';

@Injectable()
export class SharedService {
  constructor() {}

  async uploadImageFile(file: any, fileName: string) {
    return new Promise(async (resolve, reject) => {
      let bucket = Storage.bucket();
      let fileNameFinal = 'images/' + fileName;
      try {
        const blob = bucket.file(fileNameFinal);
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
            await bucket.file(fileNameFinal).setMetadata(metaData);
          } catch (error) {
            console.error(error);
            return reject({ filePath: null, error: error });
          }

          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

          try {
            await bucket.file(fileNameFinal).makePublic();
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
}
